// Form Elements
const form = document.getElementById('registerForm');
const successMessage = document.getElementById('successMessage');
const registerCard = document.querySelector('.register-form');

// Form validation
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    clearErrors();
    
    // Get form data
    const formData = {
        email: document.getElementById('email').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        middleName: document.getElementById('middleName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        terms: document.getElementById('terms').checked
    };
    
    // Validate
    let isValid = true;
    
    // Email validation
    if (!validateEmail(formData.email)) {
        showError('email', 'Моля, въведи валиден имейл адрес');
        isValid = false;
    }
    
    // Name validations
    if (formData.firstName.length < 2) {
        showError('firstName', 'Името трябва да съдържа поне 2 символа');
        isValid = false;
    }
    
    if (formData.middleName.length < 2) {
        showError('middleName', 'Презимето трябва да съдържа поне 2 символа');
        isValid = false;
    }
    
    if (formData.lastName.length < 2) {
        showError('lastName', 'Фамилията трябва да съдържа поне 2 символа');
        isValid = false;
    }
    
    // Gender validation
    if (!formData.gender) {
        showError('gender', 'Моля, избери пол');
        isValid = false;
    }
    
    // Phone validation
    if (!validatePhone(formData.phone)) {
        showError('phone', 'Моля, въведи валиден телефонен номер');
        isValid = false;
    }
    
    // Address validation
    if (formData.address.length < 5) {
        showError('address', 'Моля, въведи пълен адрес');
        isValid = false;
    }
    
    // City validation
    if (!formData.city) {
        showError('city', 'Моля, избери град');
        isValid = false;
    }
    
    // Password validation
    if (formData.password.length < 8) {
        showError('password', 'Паролата трябва да е минимум 8 символа');
        isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
        showError('confirmPassword', 'Паролите не съвпадат');
        isValid = false;
    }
    
    // Terms validation
    if (!formData.terms) {
        showError('terms', 'Трябва да приемеш условията');
        isValid = false;
    }
    
    // If valid, proceed
    if (isValid) {
        // Simulate registration process
        await registerUser(formData);
    }
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation (Bulgarian format)
function validatePhone(phone) {
    // Remove spaces and check format
    const cleaned = phone.replace(/\s/g, '');
    const re = /^(\+359|0)[0-9]{9}$/;
    return re.test(cleaned);
}

// Show error message
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const formGroup = errorElement.closest('.form-group');
    
    errorElement.textContent = message;
    errorElement.classList.add('show');
    formGroup.classList.add('error');
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    document.querySelectorAll('.form-group').forEach(el => {
        el.classList.remove('error');
    });
}

// Register user (simulated)
async function registerUser(userData) {
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Регистриране...</span>';
    submitBtn.disabled = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store user data in localStorage (for demo purposes)
    const users = JSON.parse(localStorage.getItem('imamgo_users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
        showError('email', 'Този имейл вече е регистриран');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    // Add verification token
    const verificationToken = generateToken();
    userData.verificationToken = verificationToken;
    userData.verified = false;
    userData.createdAt = new Date().toISOString();
    
    // Save user
    users.push(userData);
    localStorage.setItem('imamgo_users', JSON.stringify(users));
    
    // Send verification email (simulated)
    console.log('📧 Изпращане на имейл за потвърждение до:', userData.email);
    console.log('🔗 Линк за потвърждение:', `verify.html?token=${verificationToken}`);
    
    // For demo purposes, auto-verify after showing success message
    setTimeout(() => {
        // Auto-verify for demo
        user.verified = true;
        const updatedUsers = JSON.parse(localStorage.getItem('imamgo_users') || '[]');
        const userIndex = updatedUsers.findIndex(u => u.email === userData.email);
        if (userIndex !== -1) {
            updatedUsers[userIndex].verified = true;
            localStorage.setItem('imamgo_users', JSON.stringify(updatedUsers));
        }
        
        // Set as logged in
        localStorage.setItem('imamgo_current_user', JSON.stringify(userData));
        localStorage.removeItem('pending_verification');
        
        console.log('✅ Auto-verified for demo purposes');
    }, 1000);
    
    // Show success message
    registerCard.style.display = 'none';
    successMessage.classList.remove('hidden');
    document.getElementById('userEmail').textContent = userData.email;
    
    // Store pending verification
    localStorage.setItem('pending_verification', userData.email);
    
    // Auto redirect countdown
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    const goToAppBtn = document.getElementById('goToAppBtn');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'swipe.html';
        }
    }, 1000);
    
    // Manual redirect button
    goToAppBtn.onclick = () => {
        clearInterval(countdownInterval);
        window.location.href = 'swipe.html';
    };
}

// Generate verification token
function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Real-time validation
document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        showError('email', 'Невалиден имейл адрес');
    }
});

document.getElementById('phone').addEventListener('blur', function() {
    if (this.value && !validatePhone(this.value)) {
        showError('phone', 'Невалиден телефонен номер');
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    if (this.value && this.value !== password) {
        showError('confirmPassword', 'Паролите не съвпадат');
    } else {
        document.getElementById('confirmPasswordError').classList.remove('show');
    }
});

// Clear error on input
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        formGroup.classList.remove('error');
    });
});

console.log('📝 Регистрационна форма зареден');
