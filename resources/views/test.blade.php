<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Atha Construction</title>
        <link rel="stylesheet" href="style.css" />

        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: system-ui, sans-serif;
            }

            body {
                background: #0f172a;
                color: #fff;
            }

            /* HERO */
            .hero {
                position: relative;
                height: 100vh;
                overflow: hidden;
            }

            /* PARALLAX LAYERS */
            .layer {
                position: absolute;
                inset: 0;
                background-size: cover;
                background-position: center;
                will-change: transform;
            }

            /* Replace images with your own */
            .bg {
                background-image: url('https://images.unsplash.com/photo-1503387762-592deb58ef4e');
            }

            .mid {
                background-image: url('https://images.unsplash.com/photo-1504307651254-35680f356dfd');
                opacity: 0.85;
            }

            .front {
                background-image: url('https://images.unsplash.com/photo-1494145904049-0dca59b4bbad');
            }

            /* DARK OVERLAY */
            .hero::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.6),
                    rgba(0, 0, 0, 0.3)
                );
                z-index: 3;
            }

            /* CONTENT */
            .hero-content {
                position: relative;
                z-index: 5;
                max-width: 700px;
                padding: 0 2rem;
                top: 50%;
                transform: translateY(-50%);
            }

            .hero-content h1 {
                font-size: clamp(2rem, 4vw, 3.5rem);
                line-height: 1.2;
            }

            .hero-content h1 span {
                color: #facc15;
            }

            .hero-content p {
                margin-top: 1rem;
                font-size: 1.1rem;
                opacity: 0.9;
            }

            /* BUTTONS */
            .buttons {
                margin-top: 2rem;
                display: flex;
                gap: 1rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                text-decoration: none;
                font-weight: 600;
                border-radius: 6px;
                transition: 0.3s ease;
            }

            .primary {
                background: #facc15;
                color: #000;
            }

            .primary:hover {
                background: #fde047;
            }

            .outline {
                border: 2px solid #fff;
                color: #fff;
            }

            .outline:hover {
                background: #fff;
                color: #000;
            }

            /* SPACER TO ENABLE SCROLL */
            .spacer {
                height: 150vh;
                background: #020617;
            }
        </style>
    </head>
    <body>
        <section class="hero">
            <!-- Background Layer -->
            <div class="parallax layer bg"></div>

            <!-- Mid Layer -->
            <div class="parallax layer mid"></div>

            <!-- Foreground Layer -->
            <div class="parallax layer front"></div>

            <!-- Content -->
            <div class="hero-content">
                <h1>
                    We Don’t Just Build Structures.<br /><span
                        >We Build Trust.</span
                    >
                </h1>
                <p>
                    From foundation to finish, Atha Construction delivers
                    enduring spaces that stand the test of time.
                </p>

                <div class="buttons">
                    <a href="#" class="btn primary">View Projects</a>
                    <a href="#" class="btn outline">Get a Quote</a>
                </div>
            </div>
        </section>

        <section class="spacer"></section>

        <script src="script.js"></script>

        <script>
            const layers = document.querySelectorAll('.parallax');

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;

                layers.forEach((layer) => {
                    let speed = 0;

                    if (layer.classList.contains('bg')) speed = 0.2;
                    if (layer.classList.contains('mid')) speed = 0.4;
                    if (layer.classList.contains('front')) speed = 0.6;

                    layer.style.transform = `translateY(${scrollY * speed}px)`;
                });
            });
        </script>
    </body>
</html>
