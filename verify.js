// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

const verifyIcon = document.getElementById('verifyIcon');
const verifyTitle = document.getElementById('verifyTitle');
const verifyMessage = document.getElementById('verifyMessage');
const actionBtn = document.getElementById('actionBtn');

// Verify token
async function verifyEmail() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (!token) {
        showError('Невалиден линк за потвърждение');
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('imamgo_users') || '[]');
    const user = users.find(u => u.verificationToken === token);
    
    if (!user) {
        showError('Невалиден или изтекъл линк');
        return;
    }
    
    if (user.verified) {
        showAlreadyVerified();
        return;
    }
    
    // Mark as verified
    user.verified = true;
    localStorage.setItem('imamgo_users', JSON.stringify(users));
    
    // Set as logged in
    localStorage.setItem('imamgo_current_user', JSON.stringify(user));
    localStorage.removeItem('pending_verification');
    
    showSuccess(user);
}

function showSuccess(user) {
    verifyIcon.textContent = '✅';
    verifyTitle.textContent = 'Успешно потвърждение!';
    verifyMessage.innerHTML = `Добре дошъл, <strong>${user.firstName}</strong>!<br>Акаунтът ти е активен и можеш да започнеш да разглеждаш продукти.`;
    
    actionBtn.textContent = 'Към продуктите';
    actionBtn.classList.add('success');
    actionBtn.style.display = 'block';
    
    // Auto redirect after 3 seconds
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        actionBtn.textContent = `Към продуктите (${countdown}s)`;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            window.location.href = 'swipe.html';
        }
    }, 1000);
    
    actionBtn.onclick = () => {
        clearInterval(countdownInterval);
        window.location.href = 'swipe.html';
    };
}

function showAlreadyVerified() {
    verifyIcon.textContent = '✓';
    verifyTitle.textContent = 'Вече потвърден';
    verifyMessage.textContent = 'Този акаунт вече е потвърден. Можеш да влезеш в профила си.';
    
    actionBtn.textContent = 'Влез в профила';
    actionBtn.classList.add('success');
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => window.location.href = 'login.html';
}

function showError(message) {
    verifyIcon.textContent = '❌';
    verifyTitle.textContent = 'Грешка';
    verifyMessage.textContent = message;
    
    actionBtn.textContent = 'Към началото';
    actionBtn.classList.add('error');
    actionBtn.style.display = 'block';
    actionBtn.onclick = () => window.location.href = 'welcome.html';
}

// Start verification
verifyEmail();
