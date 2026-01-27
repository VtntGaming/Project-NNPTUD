const fs = require('fs');
const Student = require('./Student');

// Create 3 student objects
const student1 = new Student(
  'Thiên',           // First name (tên)
  'Tất Nhật',        // Middle name (tên lót)
  'Võ',              // Last name (họ)
  { day: 15, month: 5, year: 2004 }, // Date of birth
  [8.5, 9.0, 7.5, 8.0, 9.5]         // Scores
);

const student2 = new Student(
  'An',              // First name (tên)
  'Văn',             // Middle name (tên lót)
  'Nguyễn',          // Last name (họ)
  { day: 20, month: 3, year: 2003 }, // Date of birth
  [7.0, 8.5, 6.5, 9.0, 7.5]         // Scores
);

const student3 = new Student(
  'Hương',           // First name (tên)
  'Thị Thu',         // Middle name (tên lót)
  'Trần',            // Last name (họ)
  { day: 10, month: 12, year: 2004 }, // Date of birth
  [9.0, 9.5, 8.5, 10.0, 9.0]         // Scores
);

// Array of all students
const students = [student1, student2, student3];

// Display information for each student
console.log('=== STUDENT INFORMATION ===\n');

students.forEach((student, index) => {
  console.log(`--- Student ${index + 1} ---`);
  console.log(`Full Name (Họ và tên): ${student.getFullName()}`);
  console.log(`Date of Birth (Ngày sinh): ${student.formatDateOfBirth()}`);
  console.log(`Age (Tuổi): ${student.calculateAge()}`);
  console.log(`Scores (Điểm): ${student.scores.join(', ')}`);
  const avgScore = student.calculateAverageScore();
  console.log(`Average Score (Điểm TBC): ${avgScore !== null ? avgScore.toFixed(2) : 'N/A'}`);
  console.log('');
});

// Create JSON files for each student
const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

students.forEach((student, index) => {
  const jsonContent = JSON.stringify(student.toJSON(), null, 2);
  const fileName = `${outputDir}/student${index + 1}.json`;
  fs.writeFileSync(fileName, jsonContent, 'utf8');
  console.log(`Created JSON file: ${fileName}`);
});

console.log('\n=== JSON FILES CREATED SUCCESSFULLY ===');
