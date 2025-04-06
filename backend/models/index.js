import Student from './student';
import Contact from './contact';


Student.hasMany(Contact, { foreignKey: 'student_id' });
Contact.belongsTo(Student, { foreignKey: 'student_id' });

export { Student, Contact };