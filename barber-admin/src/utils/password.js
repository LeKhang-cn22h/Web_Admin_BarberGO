// src/utils/password.js
/**
 * Generate a secure random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} Random password
 */
export function generateSecurePassword(length = 12) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  const allChars = uppercase + lowercase + numbers + symbols
  
  let password = ''
  
  // Đảm bảo có ít nhất 1 ký tự mỗi loại
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // Fill phần còn lại
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }
  
  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Transform email to owner email
 * @param {string} email - Original email
 * @returns {string} Owner email
 * 
 * Examples:
 * user@gmail.com → owner.user@gmail.com
 * test@example.com → owner.test@example.com
 */
export function transformToOwnerEmail(email) {
  if (!email) return ''
  
  const [localPart, domain] = email.split('@')
  
  // Nếu đã có "owner" rồi thì không thêm nữa
  if (localPart.toLowerCase().startsWith('owner')) {
    return email
  }
  
  return `owner.${localPart}@${domain}`
}