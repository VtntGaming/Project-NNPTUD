/**
 * Student class representing a student with personal information and scores
 */
class Student {
  /**
   * Creates a new Student instance
   * @param {string} firstName - First name (tên)
   * @param {string} middleName - Middle name (tên lót)
   * @param {string} lastName - Last name (họ)
   * @param {Object} dateOfBirth - Date of birth object with day, month, year
   * @param {number} dateOfBirth.day - Day of birth
   * @param {number} dateOfBirth.month - Month of birth
   * @param {number} dateOfBirth.year - Year of birth
   * @param {number[]} scores - Array of scores
   */
  constructor(firstName, middleName, lastName, dateOfBirth, scores) {
    // Validate string inputs
    if (typeof firstName !== 'string' || typeof middleName !== 'string' || typeof lastName !== 'string') {
      throw new Error('firstName, middleName, and lastName must be strings');
    }

    // Validate dateOfBirth object
    if (!dateOfBirth || typeof dateOfBirth !== 'object') {
      throw new Error('dateOfBirth must be an object');
    }
    if (!Number.isInteger(dateOfBirth.day) || !Number.isInteger(dateOfBirth.month) || !Number.isInteger(dateOfBirth.year)) {
      throw new Error('dateOfBirth day, month, and year must be integers');
    }
    if (dateOfBirth.month < 1 || dateOfBirth.month > 12) {
      throw new Error('dateOfBirth month must be between 1 and 12');
    }
    if (dateOfBirth.day < 1 || dateOfBirth.day > 31) {
      throw new Error('dateOfBirth day must be between 1 and 31');
    }

    // Validate scores array
    if (!Array.isArray(scores)) {
      throw new Error('scores must be an array');
    }
    if (!scores.every(score => typeof score === 'number' && !isNaN(score))) {
      throw new Error('All scores must be valid numbers');
    }

    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.scores = scores;
  }

  /**
   * Get the full name of the student (Họ + Tên lót + Tên)
   * @returns {string} Full name
   */
  getFullName() {
    return `${this.lastName} ${this.middleName} ${this.firstName}`;
  }

  /**
   * Calculate the average score (Tính TBC điểm)
   * @returns {number|null} Average score, or null if no scores
   */
  calculateAverageScore() {
    if (this.scores.length === 0) {
      return null;
    }
    const sum = this.scores.reduce((acc, score) => acc + score, 0);
    return sum / this.scores.length;
  }

  /**
   * Format and return the date of birth as string (In ra ngày tháng năm)
   * @returns {string} Formatted date of birth (DD/MM/YYYY)
   */
  formatDateOfBirth() {
    const { day, month, year } = this.dateOfBirth;
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  /**
   * Calculate the age of the student (Tính tuổi)
   * @returns {number} Age in years
   */
  calculateAge() {
    const today = new Date();
    const birthDate = new Date(
      this.dateOfBirth.year,
      this.dateOfBirth.month - 1,
      this.dateOfBirth.day
    );
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Convert student to JSON object
   * @returns {Object} JSON representation of the student
   */
  toJSON() {
    return {
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      scores: this.scores,
      fullName: this.getFullName(),
      averageScore: this.calculateAverageScore(),
      formattedDateOfBirth: this.formatDateOfBirth(),
      age: this.calculateAge()
    };
  }
}

module.exports = Student;
