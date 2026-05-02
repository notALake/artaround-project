const jwt = require('jsonwebtoken');
const Visit = require('./models/Visit');

const activeVisits = new Map();

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Token mancante'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Token non valido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connesso: ${socket.id} — utente: ${socket.data.user.id}`);
    socket.on('create-visit', async ({ visitCode }) => {
      const visit = await Visit.findOne({ code: visitCode });

      if (!visit) {
        socket.emit('error', { message: 'Visita non trovata' });
        return;
      }

      if (visit.teacher.toString() !== socket.data.user.id) {
        socket.emit('error', { message: 'Non sei il proprietario di questa visita' });
        return;
      }

      if (activeVisits.has(visitCode)) {
        socket.emit('error', { message: 'Visita già attiva' });
        return;
      }
      visit.status = 'active';
      await visit.save();

      activeVisits.set(visitCode, {
        teacherSocketId: socket.id,
        students: new Map(),
        currentOpera: 0,
      });

      socket.join(visitCode);
      socket.data.visitCode = visitCode;
      socket.data.role = 'teacher';

      socket.emit('visit-created', { visitCode });
      console.log(`Visita creata: ${visitCode}`);
    });
    socket.on('join-visit', async ({ visitCode }) => {
      const visit = activeVisits.get(visitCode);

      if (!visit) {
        socket.emit('error', { message: 'Visita non trovata o non ancora avviata' });
        return;
      }

      const username = socket.data.user.username;

      socket.join(visitCode);
      socket.data.visitCode = visitCode;
      socket.data.role = 'student';
      visit.students.set(socket.id, username);

      socket.emit('sync-state', { currentOpera: visit.currentOpera });

      io.to(visit.teacherSocketId).emit('student-joined', {
        username,
        count: visit.students.size,
      });

      console.log(`${username} è entrato in ${visitCode}`);
    });

    socket.on('next-opera', ({ visitCode, operaIndex }) => {
      const visit = activeVisits.get(visitCode);

      if (!visit || visit.teacherSocketId !== socket.id) {
        socket.emit('error', { message: 'Non autorizzato' });
        return;
      }

      visit.currentOpera = operaIndex;
      socket.to(visitCode).emit('navigate-to', { operaIndex });
    });

    socket.on('start-quiz', ({ visitCode, quizId }) => {
      const visit = activeVisits.get(visitCode);

      if (!visit || visit.teacherSocketId !== socket.id) {
        socket.emit('error', { message: 'Non autorizzato' });
        return;
      }

      socket.to(visitCode).emit('quiz-started', { quizId });
    });

    socket.on('request-more', ({ visitCode, type }) => {
      const visit = activeVisits.get(visitCode);
      if (!visit) return;

      io.to(visit.teacherSocketId).emit('student-request', {
        username: socket.data.user.username,
        type,
      });
    });

    socket.on('disconnect', async () => {
      const { visitCode, role } = socket.data;
      if (!visitCode) return;

      const visit = activeVisits.get(visitCode);
      if (!visit) return;

      if (role === 'student') {
        visit.students.delete(socket.id);
        io.to(visit.teacherSocketId).emit('student-left', {
          username: socket.data.user.username,
          count: visit.students.size,
        });
      }

      if (role === 'teacher') {
        socket.to(visitCode).emit('visit-ended');

        await Visit.findOneAndUpdate(
          { code: visitCode },
          { status: 'ended' }
        );

        activeVisits.delete(visitCode);
        console.log(`Visita ${visitCode} terminata`);
      }
    });

  });

};
