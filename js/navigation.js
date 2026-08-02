(function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-links');
    const overlay = document.querySelector('.nav-overlay');

    if (!toggle || !menu) return;

    function setMenu(open) {
        menu.classList.toggle('is-open', open);
        toggle.classList.toggle('is-active', open);
        if (overlay) overlay.classList.toggle('is-visible', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
        setMenu(!menu.classList.contains('is-open'));
    });

    if (overlay) {
        overlay.addEventListener('click', function () {
            setMenu(false);
        });
    }

    menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            setMenu(false);
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setMenu(false);
    });
}());
