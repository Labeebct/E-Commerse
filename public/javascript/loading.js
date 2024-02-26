document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading_screen');
    loadingScreen.style.display = 'flex';

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });
});