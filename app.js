// Sample data - обяви за продукти
const items = [
    {
        id: 1,
        title: "Smieg тостер",
        price: "80 лв",
        location: "София",
        description: "Почти нов тостер SMEG в отлично състояние. Използван само няколко пъти. Красив дизайн, перфектен за всяка кухня.",
        image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
        category: "Дом",
        tags: ["#дом", "#кухня", "#smeg"]
    },
    {
        id: 2,
        title: "Vintage лампа",
        price: "30 лв",
        location: "Пловдив",
        description: "Красива винтидж лампа с уникален дизайн. Идеална за създаване на топла атмосфера в дома.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800",
        category: "Декорация",
        tags: ["#винтидж", "#лампа", "#декорация"]
    },
    {
        id: 3,
        title: "Книга 1984",
        price: "15 лв",
        location: "София",
        description: "Класиката на Джордж Оруел в отлично състояние. Прочетена само веднъж.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
        category: "Книги",
        tags: ["#книги", "#класика"]
    },
    {
        id: 4,
        title: "Ретро радио",
        price: "45 лв",
        location: "Варна",
        description: "Работещо винтидж радио от 80-те. Страхотен звук и уникален вид.",
        image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800",
        category: "Електроника",
        tags: ["#ретро", "#радио", "#винтидж"]
    },
    {
        id: 5,
        title: "Малка саксия",
        price: "10 лв",
        location: "София",
        description: "Красива керамична саксия с растение. Перфектна за офис или дом.",
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800",
        category: "Растения",
        tags: ["#растения", "#декорация"]
    },
    {
        id: 6,
        title: "Tablet",
        price: "120 лв",
        location: "Пловдив",
        description: "Таблет в много добро състояние. 10 инча екран, 32GB памет. Идеален за четене и гледане на филми.",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
        category: "Електроника",
        tags: ["#таблет", "#технология"]
    },
    {
        id: 7,
        title: "Дървена рамка",
        price: "20 лв",
        location: "София",
        description: "Ръчно изработена дървена рамка за снимки. Уникален дизайн.",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800",
        category: "Декорация",
        tags: ["#рамка", "#дърво", "#handmade"]
    },
    {
        id: 8,
        title: "Пъзел 1000 парчета",
        price: "25 лв",
        location: "Бургас",
        description: "Красив пъзел с пейзаж. Всички парчета са на място. Използван веднъж.",
        image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800",
        category: "Игри",
        tags: ["#пъзел", "#игри"]
    }
];

// App State
let currentIndex = 0;
let cards = [];
let startX = 0;
let startY = 0;
let moveX = 0;
let moveY = 0;
let isDragging = false;
let currentUser = null;

// DOM Elements
const swipeContainer = document.getElementById('swipeContainer');
const loading = document.getElementById('loading');
const skipBtn = document.getElementById('skipBtn');
const likeBtn = document.getElementById('likeBtn');
const messageBtn = document.getElementById('messageBtn');
const shareBtn = document.getElementById('shareBtn');
const saveBtn = document.getElementById('saveBtn');

// Modern control buttons
const upBtn = document.getElementById('upBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

// Click areas for mouse users
const clickLeft = document.getElementById('clickLeft');
const clickRight = document.getElementById('clickRight');
const clickUp = document.getElementById('clickUp');

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('imamgo_current_user');
    if (user) {
        currentUser = JSON.parse(user);
        console.log('👤 Влезли като:', currentUser.firstName, currentUser.lastName);
        
        // Show welcome notification
        showWelcomeNotification(currentUser.firstName);
    } else {
        console.log('👤 Не си влязъл в профил');
    }
}

// Show welcome notification
function showWelcomeNotification(name) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(78, 205, 196, 0.95);
        color: white;
        padding: 15px 30px;
        border-radius: 20px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideDown 0.5s ease-out;
    `;
    notification.textContent = `Добре дошъл, ${name}! 🎉`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Initialize App
function init() {
    checkAuth();
    loadCards();
    attachEventListeners();
}

// Create card element
function createCard(item, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.style.zIndex = items.length - index;
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="card-image">
        <div class="card-content">
            <div class="card-header">
                <div>
                    <div class="card-title">${item.title}</div>
                    <div class="card-location">📍 ${item.location}</div>
                </div>
                <div class="card-price">${item.price}</div>
            </div>
            <div class="card-description">${item.description}</div>
            <div class="card-tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <span class="card-category">${item.category}</span>
        </div>
    `;
    
    return card;
}

// Load cards
function loadCards() {
    swipeContainer.innerHTML = '';
    cards = [];
    
    // Create cards (only show 3 at a time for performance)
    const cardsToShow = Math.min(3, items.length - currentIndex);
    
    for (let i = 0; i < cardsToShow; i++) {
        const cardIndex = currentIndex + i;
        if (cardIndex < items.length) {
            const card = createCard(items[cardIndex], i);
            swipeContainer.appendChild(card);
            cards.push(card);
            
            // Add touch and mouse events to top card
            if (i === 0) {
                addCardEvents(card);
            }
        }
    }
}

// Add events to card
function addCardEvents(card) {
    // Touch events
    card.addEventListener('touchstart', handleStart, { passive: true });
    card.addEventListener('touchmove', handleMove, { passive: false });
    card.addEventListener('touchend', handleEnd);
    
    // Mouse events
    card.addEventListener('mousedown', handleStart);
    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseup', handleEnd);
    card.addEventListener('mouseleave', handleEnd);
}

// Handle drag start
function handleStart(e) {
    isDragging = true;
    this.classList.add('grabbed');
    
    const touch = e.type.includes('touch') ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
}

// Handle drag move
function handleMove(e) {
    if (!isDragging) return;
    
    const touch = e.type.includes('touch') ? e.touches[0] : e;
    moveX = touch.clientX - startX;
    moveY = touch.clientY - startY;
    
    // Apply transform
    this.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${moveX * 0.1}deg)`;
    
    // Show swipe hints
    const leftHint = document.querySelector('.swipe-hint.left');
    const rightHint = document.querySelector('.swipe-hint.right');
    const upHint = document.querySelector('.swipe-hint.up');
    
    // Reset all hints
    leftHint.classList.remove('show');
    rightHint.classList.remove('show');
    upHint.classList.remove('show');
    
    if (Math.abs(moveX) > 50) {
        if (moveX > 0) {
            this.classList.add('swiping-right');
            this.classList.remove('swiping-left');
            rightHint.classList.add('show');
        } else {
            this.classList.add('swiping-left');
            this.classList.remove('swiping-right');
            leftHint.classList.add('show');
        }
    } else if (moveY > 50) {
        // Down drag shows next hint (reuse upHint position/element)
        upHint.classList.add('show');
    } else {
        this.classList.remove('swiping-right', 'swiping-left');
    }
    
    // Prevent scrolling when swiping horizontally
    if (Math.abs(moveX) > Math.abs(moveY)) {
        e.preventDefault();
    }
}

// Handle drag end
function handleEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    this.classList.remove('grabbed', 'swiping-right', 'swiping-left');
    
    // Hide hints
    document.querySelector('.swipe-hint.left').classList.remove('show');
    document.querySelector('.swipe-hint.right').classList.remove('show');
    document.querySelector('.swipe-hint.up').classList.remove('show');
    
    const threshold = 100;
    
    // Check if swiped enough
    if (Math.abs(moveX) > threshold) {
        if (moveX > 0) {
            swipeRight(this);
        } else {
            swipeLeft(this);
        }
    } else if (moveY > threshold) {
        swipeDown(this);
    } else if (moveY < -threshold) {
        swipeUp(this);
    } else {
        // Reset position
        this.style.transform = '';
    }
    
    moveX = 0;
    moveY = 0;
}

// Swipe right (Like)
function swipeRight(card) {
    card.classList.add('swipe-right');
    console.log('❤️ Искам го:', items[currentIndex].title);
    addToFavorites(items[currentIndex]);
    showLikeToast(items[currentIndex].title);
    
    setTimeout(() => {
        nextCard();
    }, 400);
}

// Swipe left (Skip)
function swipeLeft(card) {
    card.classList.add('swipe-left');
    console.log('❌ Пропускам:', items[currentIndex].title);
    
    setTimeout(() => {
        nextCard();
    }, 400);
}

// Swipe up/down variants for next listing
function swipeUp(card) {
    card.classList.add('swipe-up');
    console.log('⬆️ Следваща обява (горен жест)');
    setTimeout(nextCard, 400);
}

function swipeDown(card) {
    card.classList.add('swipe-down');
    console.log('⬇️ Следваща обява (долен жест)');
    setTimeout(nextCard, 400);
}

// Go to next card
function nextCard() {
    currentIndex++;
    
    if (currentIndex >= items.length) {
        // Show end message
        swipeContainer.innerHTML = `
            <div class="card" style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px;">
                <div>
                    <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
                    <h2 style="color: var(--text-dark); margin-bottom: 10px;">Няма повече обяви!</h2>
                    <p style="color: var(--text-light);">Провери отново по-късно за нови предложения.</p>
                </div>
            </div>
        `;
        return;
    }
    
    loadCards();
}

// Favorites helpers
function getFavoritesKey() {
    const u = localStorage.getItem('imamgo_current_user');
    if (!u) return 'imamgo_favorites_guest';
    try {
        const parsed = JSON.parse(u);
        return `imamgo_favorites_${parsed.email || 'user'}`;
    } catch {
        return 'imamgo_favorites_user';
    }
}

function getFavorites() {
    const key = getFavoritesKey();
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [];
    }
}

function setFavorites(list) {
    const key = getFavoritesKey();
    localStorage.setItem(key, JSON.stringify(list));
}

function addToFavorites(item) {
    const favs = getFavorites();
    if (!favs.some(f => f.id === item.id)) {
        const minimal = {
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            location: item.location,
            category: item.category,
            tags: item.tags,
            addedAt: Date.now()
        };
        favs.unshift(minimal);
        setFavorites(favs);
        // Update badge count if exists
        updateFavoritesBadge();
    }
}

function updateFavoritesBadge() {
    const favCount = getFavorites().length;
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach((it) => {
        if (it.getAttribute('data-page') === 'favorites') {
            let badge = it.querySelector('.fav-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'fav-badge';
                badge.style.cssText = `
                    position: absolute; top: 8px; right: 25%; transform: translateX(50%);
                    background: #ff4d4f; color: #fff; border-radius: 10px; padding: 1px 6px;
                    font-size: 11px; font-weight: 700; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                `;
                it.style.position = 'relative';
                it.appendChild(badge);
            }
            badge.textContent = favCount;
            badge.style.display = favCount > 0 ? 'inline-block' : 'none';
        }
    });
}

function showLikeToast(title) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 110px; left: 50%; transform: translateX(-50%);
        background: rgba(46, 204, 113, 0.95); color: #fff; padding: 12px 18px;
        border-radius: 16px; font-weight: 700; z-index: 1200; box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    `;
    toast.textContent = `Добавено в Любими: ${title}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 1600);
}

// Button click handlers
skipBtn.addEventListener('click', () => {
    const topCard = cards[0];
    if (topCard) {
        topCard.style.transform = 'translateX(-500px) rotate(-30deg)';
        swipeLeft(topCard);
    }
});

likeBtn.addEventListener('click', () => {
    const topCard = cards[0];
    if (topCard) {
        topCard.style.transform = 'translateX(500px) rotate(30deg)';
        swipeRight(topCard);
    }
});

// Modern control buttons (optional UI)
if (upBtn) {
    upBtn.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            topCard.style.transform = 'translateY(-500px)';
            swipeUp(topCard);
        }
    });
}

if (leftBtn) {
    leftBtn.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            topCard.style.transform = 'translateX(-500px) rotate(-30deg)';
            swipeLeft(topCard);
        }
    });
}

if (rightBtn) {
    rightBtn.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            topCard.style.transform = 'translateX(500px) rotate(30deg)';
            swipeRight(topCard);
        }
    });
}

messageBtn.addEventListener('click', () => {
    console.log('💬 Съобщение до продавача');
    alert('Отваряне на чат с продавача...');
});

shareBtn.addEventListener('click', () => {
    console.log('📤 Споделяне на обявата');
    alert('Споделяне...');
});

saveBtn.addEventListener('click', () => {
    console.log('🔖 Запазване на обявата');
    alert('Обявата е запазена!');
});

// Click Areas handlers (work even if arrow buttons are hidden)
if (clickLeft) {
    clickLeft.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            topCard.style.transform = 'translateX(-500px) rotate(-30deg)';
            swipeLeft(topCard);
        }
    });
}

if (clickRight) {
    clickRight.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            topCard.style.transform = 'translateX(500px) rotate(30deg)';
            swipeRight(topCard);
        }
    });
}

if (clickUp) {
    clickUp.addEventListener('click', () => {
        const topCard = cards[0];
        if (topCard) {
            // Center badge now represents DOWN (Следваща надолу)
            topCard.style.transform = 'translateY(500px)';
            swipeDown(topCard);
        }
    });
}

// Attach event listeners
function attachEventListeners() {
    // Navigation items
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Handle navigation
            switch(page) {
                case 'home':
                    window.location.href = 'home.html';
                    break;
                case 'favorites':
                    window.location.href = 'favorites.html';
                    break;
                case 'add':
                    window.location.href = 'home.html';
                    console.log('➕ Добавяне на обява');
                    break;
                case 'messages':
                    console.log('💬 Съобщения');
                    // TODO: Implement messages
                    break;
                case 'profile':
                    console.log('👤 Профил');
                    // TODO: Implement profile
                    break;
            }
        });
    });
    
    // Keyboard shortcuts (work even if control buttons are hidden or removed)
    document.addEventListener('keydown', (e) => {
        const topCard = cards[0];
        if (!topCard) return;

        if (e.key === 'ArrowLeft') {
            topCard.style.transform = 'translateX(-500px) rotate(-30deg)';
            swipeLeft(topCard);
        } else if (e.key === 'ArrowRight') {
            topCard.style.transform = 'translateX(500px) rotate(30deg)';
            swipeRight(topCard);
        } else if (e.key === 'ArrowUp') {
            topCard.style.transform = 'translateY(-500px)';
            swipeUp(topCard);
        } else if (e.key === 'ArrowDown') {
            topCard.style.transform = 'translateY(500px)';
            swipeDown(topCard);
        }
    });

    // Mouse wheel scroll triggers next (down) or alternative (up) navigation
    let wheelCooldown = false;
    document.addEventListener('wheel', (e) => {
        if (wheelCooldown) return;
        const topCard = cards[0];
        if (!topCard) return;
        // Trigger only on meaningful scroll
        if (Math.abs(e.deltaY) < 10) return;
        wheelCooldown = true;
        if (e.deltaY > 0) {
            // Scroll down: next card via swipeDown
            topCard.style.transform = 'translateY(500px)';
            swipeDown(topCard);
        } else {
            // Scroll up: also go to next (using upward animation) until "previous" feature is implemented
            topCard.style.transform = 'translateY(-500px)';
            swipeUp(topCard);
        }
        setTimeout(() => wheelCooldown = false, 450); // prevent rapid multi-fire
    }, { passive: true });
}

// Start the app
window.addEventListener('DOMContentLoaded', init);
