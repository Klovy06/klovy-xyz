const container = document.getElementById("container");
if (container) {
    container.onmousemove = e => {
        for (const card of document.getElementsByClassName("card")) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        }
    };
}

function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;

    const quantity = 80;
    const speed = 0.3;
    const radiusMin = 0.5;
    const radiusMax = 1.6;
    const linkDistance = 110;

    let rgb = '255, 255, 255';
    let dotAlpha = 0.45;
    let lineAlphaMax = 0.12;

    const particles = [];

    function readRgb() {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--particles-color').trim();
        rgb = raw || '255, 255, 255';
        const d = Number(getComputedStyle(document.documentElement).getPropertyValue('--particles-dot-alpha').trim());
        const l = Number(getComputedStyle(document.documentElement).getPropertyValue('--particles-line-alpha').trim());
        dotAlpha = Number.isFinite(d) ? d : 0.45;
        lineAlphaMax = Number.isFinite(l) ? l : 0.12;
    }

    function resize() {
        w = Math.floor(window.innerWidth);
        h = Math.floor(window.innerHeight);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const rand = (mn, mx) => Math.random() * (mx - mn) + mn;

    function makeParticle() {
        return { x: rand(0, w), y: rand(0, h), vx: rand(-speed, speed), vy: rand(-speed, speed), r: rand(radiusMin, radiusMax) };
    }

    function seed() {
        particles.length = 0;
        for (let i = 0; i < quantity; i++) particles.push(makeParticle());
    }

    function step() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;
        }
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < linkDistance) {
                    ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / linkDistance) * lineAlphaMax})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
        for (const p of particles) {
            ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(step);
    }

    resize(); readRgb(); seed(); step();
    window.addEventListener('resize', () => { resize(); seed(); });

    const media = window.matchMedia('(prefers-color-scheme: light)');
    const fn = () => readRgb();
    (typeof media.addEventListener === 'function' ? media.addEventListener : media.addListener).call(
        media, typeof media.addEventListener === 'function' ? 'change' : fn, fn
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const emailEl = document.getElementById('emailBox');
    if (emailEl) {
        const u = emailEl.getAttribute('data-user');
        const d = emailEl.getAttribute('data-domain');
        const t = emailEl.getAttribute('data-tld');
        if (u && d && t) emailEl.textContent = `${u}@${d}.${t}`;
    }

    const dropdown = document.getElementById('langDropdown');
    const toggle   = document.getElementById('langToggle');
    const menu     = document.getElementById('langMenu');

    function setDropdownOpen(open) {
        if (!dropdown || !toggle || !menu) return;
        dropdown.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
    }

    if (dropdown && toggle && menu) {
        toggle.addEventListener('click', e => {
            e.preventDefault();
            setDropdownOpen(!dropdown.classList.contains('open'));
        });
        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target)) setDropdownOpen(false);
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
                closeProjectModal();
                closeEcosystemModal();
                closeDeveloperModal();
                closePostsModal();
                closePostReadModal();
            }
        });
    }

    initParticles();
    loadPosts();
});

const translations = {
    pl: {
        hero_label: '// developer',
        hero_hint: '// kliknij aby dowiedzieć się więcej',
        hero_desc: 'Tworzę nowoczesne aplikacje webowe w React, TypeScript i Vite, skupiając się na czystym kodzie, wydajności i projektach rozwiązujących realne problemy. Rozwijam się w ekosystemie JavaScript, pracuję również z Node.js, interesując się całym procesem tworzenia produktu – od pomysłu i architektury po rozwój i optymalizację. Lubię budować projekty od podstaw, eksperymentować z nowymi rozwiązaniami i tworzyć stabilne, nowoczesne aplikacje o przemyślanej strukturze.',
        social_eyebrow: '// znajdź mnie',
        contact_eyebrow: '// kontakt',
        ecosystem_eyebrow: '// ecosystem',
        projects_eyebrow: '// projekty',
        projects_title: 'Projekty',
        posts_eyebrow: '// blog',
        posts_title: 'Posty',
        posts_loading: 'Ładowanie...',
        posts_see_all: 'Zobacz wszystkie →',
        posts_back: 'Wróć do listy',
        posts_no_posts: 'Brak postów.',
        modal_title: 'Porozmawiajmy',
        modal_desc: 'Masz projekt lub pomysł?<br>Napisz — chętnie porozmawiam.',
        project_klovy_desc: 'Edukacyjny projekt informatyczny, którego celem jest tworzenie wartościowych treści w formie poradników i instrukcji dla branży IT. Projekt obejmuje również przygotowanie materiałów edukacyjnych dla szkół na różnych poziomach nauczania – od szkół podstawowych i średnich po szkolnictwo wyższe. Celem inicjatywy jest popularyzacja wiedzy technologicznej, wspieranie rozwoju umiejętności cyfrowych oraz inspirowanie społeczności do zdobywania nowych umiejętności w dynamicznie rozwijającym się środowisku IT.',
        project_klovy_date: '2 sierpnia 2021 — 18 sierpnia 2025',
        project_chat_desc: 'Projekt nowoczesnego komunikatora internetowego opartego na nowoczesnych technologiach webowych. Odpowiada za projektowanie i wdrażanie kluczowych funkcjonalności, optymalizację wydajności aplikacji oraz zapewnienie stabilności i bezpieczeństwa systemu. Koncentruje się na zapewnieniu szybkiej, intuicyjnej i niezawodnej komunikacji w czasie rzeczywistym, kładąc nacisk na wysoką jakość doświadczenia użytkownika (UX) i skalowalność rozwiązania.',
        project_chat_date: 'Rozpoczęty 11 lutego 2025 — data premiery nieznana',
        badge_done: 'Zamknięty',
        badge_wip: 'W trakcie',
        ecosystem_title: 'Ekosystem Klovy',
        ecosystem_desc: 'Spójna rodzina projektów rozwijanych pod marką Klovy Systems.',
        ecosystem_hint: '// kliknij aby dowiedzieć się więcej',
        ecosystem_modal_desc: 'Klovy Systems to firma technologiczna rozwijająca własne produkty i rozwiązania cyfrowe, koncentrująca się na tworzeniu nowoczesnego ekosystemu narzędzi programistycznych. Jej działalność obejmuje projektowanie, rozwój i utrzymanie aplikacji, platform i usług, które mogą funkcjonować zarówno niezależnie, jak i jako część większej całości.\n\nKlovy Systems działa w modelu „platformowym" – tworzy główną bazę technologiczną i infrastrukturę, w ramach której powstają niezależne projekty i podsystemy. Jednym z takich projektów jest Klovy Chat, rozwijany jako osobna aplikacja, ale w oparciu o rozwiązania i standardy opracowane przez Klovy Systems.\n\nCelem Klovy Systems jest budowanie spójnych, skalowalnych i długoterminowych rozwiązań, które można rozwijać etapami, dodawać do większego ekosystemu i wykorzystywać w różnych kontekstach – od codziennej komunikacji po bardziej zaawansowane aplikacje technologiczne.',
        ecosystem_visit: 'Odwiedź stronę',
        copied_msg: 'SKOPIOWANO!',
        open_project: 'Otwórz projekt',
        developer_title: 'Kim jestem?',
        dev_frontend: 'Frontend',
        dev_backend: 'Backend',
        dev_tools: 'Narzędzia',
        dev_interests: 'Zainteresowania',
        dev_years: 'lata doświadczenia',
        dev_projects: 'aktywne projekty',
        dev_passion: 'pasja do kodu',
        dev_available: 'Dostępny do współpracy',
        dev_contact: 'Skontaktuj się',
        developer_bio: 'Jestem entuzjastą technologii z doświadczeniem w tworzeniu oprogramowania.',
    },
    en: {
        hero_label: '// developer',
        hero_hint: '// click to learn more',
        hero_desc: 'I build modern web applications using React, TypeScript and Vite. I\'m passionate about clean code, performance, and projects that actually matter.',
        social_eyebrow: '// find me',
        contact_eyebrow: '// contact',
        ecosystem_eyebrow: '// ecosystem',
        projects_eyebrow: '// projects',
        projects_title: 'Projects',
        posts_eyebrow: '// blog',
        posts_title: 'Posts',
        posts_loading: 'Loading...',
        posts_see_all: 'See all →',
        posts_back: 'Back to list',
        posts_no_posts: 'No posts yet.',
        modal_title: 'Let\'s Talk',
        modal_desc: 'Got a project or idea?<br>Reach out — I\'d love to chat.',
        project_klovy_desc: 'An educational IT project focused on creating valuable content in the form of guides and tutorials for the IT industry. The project also includes preparing educational materials for schools at various levels — from primary and secondary schools to higher education.',
        project_klovy_date: 'August 2, 2021 — August 18, 2025',
        project_chat_desc: 'A project for a modern internet messenger built on cutting-edge web technologies. Responsible for designing and implementing key features, optimizing application performance, and ensuring system stability and security.',
        project_chat_date: 'Started February 11, 2025 — release date unknown',
        badge_done: 'Completed',
        badge_wip: 'In progress',
        ecosystem_title: 'Klovy Ecosystem',
        ecosystem_desc: 'A cohesive family of projects built under the Klovy Systems brand.',
        ecosystem_hint: '// click to learn more',
        ecosystem_modal_desc: 'Klovy Systems is a technology company developing its own digital products and solutions, focused on building a modern ecosystem of programming tools.\n\nKlovy Systems operates on a "platform model" — it builds the core technology base and infrastructure within which independent projects and subsystems are created.\n\nThe goal of Klovy Systems is to build coherent, scalable and long-term solutions that can be developed in stages and used in various contexts.',
        ecosystem_visit: 'Visit website',
        copied_msg: 'COPIED!',
        open_project: 'Open project',
        developer_title: 'Who am I?',
        dev_frontend: 'Frontend',
        dev_backend: 'Backend',
        dev_tools: 'Tools',
        dev_interests: 'Interests',
        dev_years: 'years of experience',
        dev_projects: 'active projects',
        dev_passion: 'passion for code',
        dev_available: 'Available for work',
        dev_contact: 'Get in touch',
        developer_bio: 'I am a technology enthusiast with experience in software development.',
    }
};

function getAge() {
    const birth = new Date(2006, 2, 3);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const notYetBirthday =
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
    if (notYetBirthday) age--;
    return age;
}

const devSections = {
    pl: [
        {
            icon: 'ph-fill ph-user',
            title: 'O mnie',
            subsections: [
                {
                    heading: 'Podstawowe informacje',
                    text: 'Mam ' + getAge() + ' lat i pochodzę z Wolsztyna w województwie wielkopolskim. Jestem entuzjastą technologii z pasją do tworzenia oprogramowania, którą rozwijam od maja 2020 roku. Posługuję się językiem polskim, a w kontekście technicznym i pracy z dokumentacją znam również podstawy języka angielskiego.'
                },
                {
                    heading: 'Początki przygody z programowaniem',
                    text: 'Wszystko zaczęło się od pomocy bratu przy prostej stronie internetowej w HTML — zadaniu szkolnym, które okazało się punktem zwrotnym. To ćwiczenie wzbudziło moje zainteresowanie i stało się impulsem do dalszej, samodzielnej nauki: najpierw HTML, następnie CSS, a z czasem JavaScript, TypeScript i kolejne technologie.'
                },
                {
                    heading: 'Spektrum autyzmu',
                    text: 'Zmagam się ze spektrum autyzmu — zdiagnozowanym we wczesnym dzieciństwie, około trzeciego roku życia. Stanowi ono nieodłączną część mojej osobowości i w dużej mierze kształtuje sposób, w jaki postrzegam świat oraz podchodzę do pracy. Cechuje mnie duże skupienie na szczegółach, analityczny sposób myślenia oraz głęboka pasja do obszarów, którymi się interesuję — co w kontekście programowania przekłada się na staranne, przemyślane i konsekwentne podejście do tworzenia oprogramowania.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-code',
            title: 'Technologie & umiejętności',
            subsections: [
                {
                    heading: 'Języki programowania',
                    text: 'Na co dzień pracuję przede wszystkim w JavaScript i TypeScript — językach, które stanowią fundament moich projektów frontendowych i backendowych. Aktywnie rozwijam również umiejętności w języku Python, który coraz częściej znajduje zastosowanie w moich projektach narzędziowych i automatyzacyjnych.'
                },
                {
                    heading: 'Infrastruktura & serwery',
                    text: 'Posiadam doświadczenie w samodzielnym konfigurowaniu i utrzymaniu serwerów VPS. Pracowałem z platformą wirtualizacyjną Proxmox, umożliwiającą zarządzanie maszynami wirtualnymi i kontenerami. W zakresie serwerów HTTP mam praktyczne doświadczenie z NGINX, Apache oraz Caddy — konfigurowałem wirtualne hosty, przekierowania, obsługę SSL oraz reverse proxy. Do monitorowania infrastruktury i wizualizacji metryk korzystam z Grafany. W obszarze bezpieczeństwa serwerów stosuję Fail2Ban do automatycznej ochrony przed atakami brute-force oraz nieautoryzowanym dostępem. W przyszłości planuję znacząco poszerzyć swoje kompetencje w zakresie ekosystemu Cloudflare — w szczególności zamierzam wdrożyć Cloudflare R2 jako rozwiązanie do przechowywania obiektów w chmurze, stanowiące kompatybilną z protokołem S3 alternatywę dla tradycyjnych usług bucket storage.'
                },
                {
                    heading: 'WordPress',
                    text: 'Posiadam również doświadczenie w pracy z systemem zarządzania treścią WordPress. Zajmowałem się instalacją, konfiguracją oraz utrzymaniem witryn opartych na tej platformie, a także dostosowywaniem motywów i wtyczek do indywidualnych potrzeb projektów. Praktyczna znajomość WordPressa pozwala mi sprawnie realizować projekty wymagające szybkiego wdrożenia funkcjonalnego i estetycznego serwisu internetowego, bez konieczności budowania infrastruktury od podstaw.'
                },
                {
                    heading: 'Bazy danych',
                    text: 'W zakresie przechowywania i zarządzania danymi posługuję się bazami MongoDB oraz MySQL. MongoDB stosuję w projektach wymagających elastycznej struktury dokumentowej i wysokiej skalowalności, natomiast MySQL wykorzystuję w zastosowaniach opartych na relacyjnym modelu danych, gdzie kluczowa jest integralność i spójność informacji. W przyszłości planuję poszerzyć swoje kompetencje o obsługę PostgreSQL oraz wdrożenie Redis jako warstwy cache.'
                },
                {
                    heading: 'Styl pracy & współpraca',
                    text: 'Projekty najczęściej realizuję samodzielnie, jednak doceniam współpracę zespołową — wiele przedsięwzięć nie byłoby możliwych bez pomocy innych. Formalnych certyfikatów jeszcze nie posiadam, jednak planuję je zdobyć po ukończeniu szkoły, aby potwierdzić swoje umiejętności w sposób formalny.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-buildings',
            title: 'Klovy Systems',
            subsections: [
                {
                    heading: 'Geneza i misja',
                    text: 'Jestem założycielem i liderem Klovy Systems — inicjatywy poświęconej tworzeniu innowacyjnych produktów cyfrowych, narzędzi i platform dla programistów i entuzjastów technologii. Inicjatywa powstała z potrzeby posiadania spójnej marki, pod którą mogłyby funkcjonować różnorodne projekty technologiczne rozwijane przeze mnie z myślą o realnym zastosowaniu.'
                },
                {
                    heading: 'Model platformowy',
                    text: 'W ramach ekosystemu nadzoruję projektowanie i rozwój projektów działających zarówno jako samodzielne rozwiązania, jak i zintegrowane komponenty większej infrastruktury. Klovy Systems funkcjonuje w modelu platformowym — tworząc wspólną bazę technologiczną, standardy i infrastrukturę, w oparciu o które powstają kolejne projekty, takie jak Klovy Chat.'
                },
                {
                    heading: 'Cel długoterminowy',
                    text: 'Moim długoterminowym celem jest zbudowanie zrównoważonego, skalowalnego ekosystemu technologicznego — zestawu wszechstronnych narzędzi i usług, które znajdą zastosowanie w szerokim spektrum kontekstów: od codziennych narzędzi komunikacyjnych po zaawansowane rozwiązania infrastrukturalne.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-graduation-cap',
            title: 'Edukacja & plany',
            subsections: [
                {
                    heading: 'Aktualna edukacja',
                    text: 'Obecnie kończę naukę w Zespole Szkół Zawodowych im. Marcina Rożka w Wolsztynie, w technikum informatycznym. Zdobywane w toku edukacji umiejętności praktyczne stanowią solidne uzupełnienie wiedzy, którą rozwijam samodzielnie w ramach własnych projektów.'
                },
                {
                    heading: 'Plany akademickie',
                    text: 'W przyszłości planuję kontynuować edukację na studiach związanych z cyberbezpieczeństwem — dziedzinie, która łączy moje zainteresowanie bezpieczeństwem systemów z ambicjami zawodowymi. Moim celem jest zdobycie tytułu inżyniera, a następnie — jeśli będzie taka możliwość — również tytułu magistra.'
                },
                {
                    heading: 'Aktywność dodatkowa',
                    text: 'W trakcie edukacji miałem okazję brać udział w różnych inicjatywach szkolnych. W 2023 roku uczestniczyłem w konkursie graficznym, tworząc projekt logo Parowozowni Wolsztyn, a także w konkursie młodych talentów literackich — co pozwoliło mi rozwijać kreatywność również poza obszarem technicznym.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-music-note',
            title: 'Poza kodem',
            subsections: [
                {
                    heading: 'Muzyka',
                    text: 'Muzyka stanowi istotny element mojego życia codziennego — zarówno od strony twórczej, jak i jako forma relaksu. Hobbystycznie tworzę mixy i instrumentale w FL Studio, a w przyszłości planuję rozwijać się w kierunku mashupów i remixów. Regularnie słucham muzyki różnych gatunków, ze szczególnym upodobaniem do Disco Polo, Dance oraz Pop.'
                },
                {
                    heading: 'Sport',
                    text: 'Jestem zapalonym fanem sportów zarówno letnich, jak i zimowych. Z dużym zainteresowaniem śledzę zmagania sportowców na najwyższym poziomie — wśród dyscyplin, które cenię szczególnie, znajdują się skoki narciarskie, lekkoatletyka, a także szereg innych konkurencji, w których precyzja, technika i wytrzymałość odgrywają kluczową rolę.'
                },
                {
                    heading: 'Odpoczynek & świeże powietrze',
                    text: 'W wolnym czasie cenię sobie spokojny odpoczynek — lubię oglądać telewizję, przeglądać internet oraz pracować z ekosystemem Adobe: Photoshop, Illustrator i Premiere Pro. Chętnie spędzam czas na świeżym powietrzu; szczególnie upodobałem sobie okresy letnie, kiedy mogę korzystać z ciepłej pogody i czerpać radość z przebywania na zewnątrz.'
                },
                {
                    heading: 'Gry',
                    text: 'W wolnym czasie gram w gry wyścigowe i nie tylko — Trackmania 2 Stadium, Euro Truck Simulator 2, Forza Horizon 4, Counter-Strike 2, a sporadycznie też Fortnite, Rocket League czy Fall Guys.'
                },
                {
                    heading: 'Technologia codzienna',
                    text: 'Jestem zagorzałym fanem ekosystemu Apple — cenię jego spójność, jakość wykonania oraz płynną integrację urządzeń i usług. Filozofia projektowania Apple, stawiająca na prostotę, niezawodność i dbałość o szczegóły, jest bliska mojemu własnemu podejściu do tworzenia oprogramowania. Na Androidzie szczególnie cenię serię telefonów Samsung.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-gear',
            title: 'Styl pracy',
            subsections: [
                {
                    heading: 'Podejście',
                    text: 'Preferuję spokojny i dokładny styl pracy — głęboko wierzę, że pośpiech prowadzi do błędów, których późniejsze naprawianie pochłania więcej czasu niż staranne wykonanie zadania od samego początku. Staram się realizować projekty w sposób przemyślany i dopracowany, poświęcając odpowiednią uwagę każdemu etapowi procesu twórczego.'
                },
                {
                    heading: 'Rytm dnia',
                    text: 'Najlepiej pracuje mi się po spokojnym rozpoczęciu dnia — kiedy mam czas na stopniowe wdrożenie się w zadania, jestem w stanie osiągnąć znacznie wyższy poziom skupienia i efektywności. Jakość i dokładność są dla mnie zawsze ważniejsze niż szybkie, niedopracowane rezultaty.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-desktop-tower',
            title: 'Infrastruktura',
            subsections: [
                {
                    heading: 'Systemy operacyjne serwerów',
                    text: 'Posiadam doświadczenie w administracji zarówno systemami Linux Server, jak i Windows Server. Zdecydowanie lepiej czuję się w środowisku Linux Server — to na tej platformie realizuję zdecydowaną większość swoich projektów infrastrukturalnych. Cenię go za stabilność, elastyczność konfiguracji, wydajność oraz szerokie możliwości automatyzacji za pomocą skryptów powłoki.'
                },
                {
                    heading: 'Serwer domowy — Dell Wyse 5070',
                    text: 'Do obsługi lekkich zadań wykorzystuję serwer domowy oparty na stacji roboczej Dell Wyse 5070. Jest to kompaktowe, energooszczędne urządzenie klasy biznesowej, pracujące całodobowo w oparciu o łącze światłowodowe o przepustowości 300/50 Mbps. Hostuję na nim boty Discord, repozytorium plików w oparciu o CasaOS oraz lżejsze skrypty i usługi pomocnicze.'
                },
                {
                    heading: 'Serwery VPS i dedykowane',
                    text: 'W przypadku projektów wymagających większej mocy obliczeniowej lub niezawodności na poziomie produkcyjnym korzystam z serwerów VPS bądź dedykowanych. To właśnie na tej infrastrukturze osadzam bardziej wymagające usługi — takie jak Klovy Chat czy inne komponenty ekosystemu Klovy Systems wymagające stabilnego i skalowalnego środowiska uruchomieniowego.'
                },
                {
                    heading: 'Filozofia i plany',
                    text: 'Świadome rozgraniczenie między infrastrukturą lokalną a chmurową pozwala mi optymalizować koszty utrzymania projektów przy zachowaniu odpowiedniego poziomu wydajności. W przyszłości planuję integrację z Cloudflare Tunnel, wdrożenie monitorowania opartego na Grafanie oraz stopniowe przenoszenie ekosystemu Klovy Systems na własną, w pełni kontrolowaną infrastrukturę sprzętową.'
                }
            ]
        }
    ],
    en: [
        {
            icon: 'ph-fill ph-user',
            title: 'About me',
            subsections: [
                {
                    heading: 'Basic information',
                    text: 'I am ' + getAge() + ' years old and come from Wolsztyn in the Greater Poland Voivodeship. I am a technology enthusiast passionate about software development, a journey I began in May 2020. I speak Polish natively and have a working knowledge of English, primarily in technical and documentation contexts.'
                },
                {
                    heading: 'How it all began',
                    text: 'Everything started when I helped my brother with a simple HTML page for school — an assignment that turned out to be a turning point. That exercise sparked my curiosity and became the impulse for further self-directed learning: first HTML, then CSS, and gradually JavaScript, TypeScript and more.'
                },
                {
                    heading: 'Autism spectrum disorder',
                    text: 'I live with autism spectrum disorder, diagnosed in early childhood at around the age of three. It is an integral part of my personality and shapes the way I perceive the world and approach my work. I am characterised by a strong focus on detail, an analytical way of thinking, and a deep passion for the areas I am interested in — which in software development translates into a careful, deliberate and consistent approach.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-code',
            title: 'Technologies & skills',
            subsections: [
                {
                    heading: 'Programming languages',
                    text: 'I primarily work with JavaScript and TypeScript on a daily basis — languages that form the foundation of my frontend and backend projects. I am also actively developing my skills in Python, which I increasingly use in tooling and automation projects.'
                },
                {
                    heading: 'Infrastructure & servers',
                    text: 'I have hands-on experience configuring and maintaining VPS servers independently. I have worked with Proxmox for managing virtual machines and containers, and have practical experience with NGINX, Apache and Caddy — configuring virtual hosts, redirects, SSL handling and reverse proxying. I use Grafana for monitoring and Fail2Ban for server security.'
                },
                {
                    heading: 'WordPress',
                    text: 'I also have experience working with WordPress — installation, configuration, maintenance and customising themes and plugins to meet project requirements.'
                },
                {
                    heading: 'Databases',
                    text: 'I work with MongoDB and MySQL. I use MongoDB for flexible document-based projects and MySQL for relational data models. I plan to expand to PostgreSQL and implement Redis as a caching layer.'
                },
                {
                    heading: 'Work style & collaboration',
                    text: 'I usually work on projects independently, but I value teamwork. I do not yet hold formal certifications, but I plan to obtain them after finishing school.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-buildings',
            title: 'Klovy Systems',
            subsections: [
                {
                    heading: 'Origin and mission',
                    text: 'I am the founder and leader of Klovy Systems — an initiative dedicated to creating innovative digital products, tools and platforms for developers and technology enthusiasts. The initiative was born from the need for a cohesive brand under which various technology projects could operate.'
                },
                {
                    heading: 'Platform model',
                    text: 'Within the ecosystem, I oversee the design and development of projects that function both as standalone solutions and as integrated components of a larger infrastructure. Klovy Systems operates on a platform model — building a shared technology base and infrastructure upon which subsequent projects are created, such as Klovy Chat.'
                },
                {
                    heading: 'Long-term goal',
                    text: 'My long-term goal is to build a sustainable, scalable technological ecosystem — a suite of versatile tools and services applicable across a wide range of contexts: from everyday communication tools to advanced infrastructure solutions.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-graduation-cap',
            title: 'Education & plans',
            subsections: [
                {
                    heading: 'Current education',
                    text: 'I am currently completing my education at the Marcin Rożek Vocational Schools Complex in Wolsztyn, in the IT technician programme. The practical skills acquired through my formal education complement the knowledge I develop independently through my own projects.'
                },
                {
                    heading: 'Academic plans',
                    text: 'In the future, I plan to pursue studies in cybersecurity — a field that combines my interest in system security with my professional ambitions. My goal is to earn an engineering degree, followed by a master\'s degree if the opportunity arises.'
                },
                {
                    heading: 'Extracurricular activity',
                    text: 'During my education I participated in various school initiatives. In 2023 I took part in a graphic design competition creating a logo for the Wolsztyn Engine Shed, and also in a young literary talents contest — allowing me to develop creativity outside the technical domain.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-music-note',
            title: 'Beyond the code',
            subsections: [
                {
                    heading: 'Music',
                    text: 'Music plays a significant role in my everyday life — both as a creative outlet and as a form of relaxation. As a hobby, I create mixes and instrumentals in FL Studio. I regularly listen to a wide range of music, with a particular fondness for Disco Polo, Dance and Pop.'
                },
                {
                    heading: 'Sport',
                    text: 'I am a passionate fan of both summer and winter sports. I follow athletic competitions at the highest level with great interest — among the disciplines I particularly appreciate are ski jumping, athletics, and events where precision, technique and endurance are decisive.'
                },
                {
                    heading: 'Rest & the outdoors',
                    text: 'In my free time I enjoy peaceful rest — watching television, browsing the internet and working within the Adobe ecosystem: Photoshop, Illustrator and Premiere Pro. I am also fond of spending time outdoors, especially in summer.'
                },
                {
                    heading: 'Gaming',
                    text: 'In my free time I enjoy playing games — Trackmania 2 Stadium, Euro Truck Simulator 2, Forza Horizon 4, Counter-Strike 2, and occasionally Fortnite, Rocket League or Fall Guys.'
                },
                {
                    heading: 'Everyday technology',
                    text: 'I am an avid enthusiast of the Apple ecosystem, which I value for its cohesion, build quality and seamless integration. Apple\'s design philosophy closely aligns with my own approach to software development. On the Android side, I have a particular appreciation for Samsung\'s smartphone lineup.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-gear',
            title: 'Work style',
            subsections: [
                {
                    heading: 'Approach',
                    text: 'I prefer a calm and thorough approach to work — I firmly believe that rushing leads to mistakes that cost more to fix than doing the job carefully from the outset. I aim to complete projects in a thoughtful and polished way, giving proper attention to every stage of the creative process.'
                },
                {
                    heading: 'Daily rhythm',
                    text: 'I work best after a relaxed start to the day — when I have time to ease into tasks gradually, I am able to achieve a significantly higher level of focus and efficiency. Quality and accuracy are always more important to me than fast, unfinished results.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-desktop-tower',
            title: 'Infrastructure',
            subsections: [
                {
                    heading: 'Server operating systems',
                    text: 'I have experience administering both Linux Server and Windows Server environments. I am significantly more proficient in Linux Server — it is the platform on which I carry out the vast majority of my infrastructure projects, valued for its stability, flexibility and automation capabilities.'
                },
                {
                    heading: 'Home server — Dell Wyse 5070',
                    text: 'For lightweight tasks I operate a home server based on a Dell Wyse 5070 workstation — a compact, energy-efficient business-class device running around the clock on a 300/50 Mbps fibre connection. I host Discord bots, a CasaOS file repository and auxiliary scripts on it.'
                },
                {
                    heading: 'VPS and dedicated servers',
                    text: 'For projects requiring greater computing power or production-level reliability I use VPS or dedicated servers. This is where I deploy more demanding services such as Klovy Chat and other components of the Klovy Systems ecosystem that require a stable and scalable runtime environment.'
                },
                {
                    heading: 'Philosophy and plans',
                    text: 'The deliberate separation between local and cloud infrastructure allows me to optimise costs while maintaining appropriate performance. Future plans include Cloudflare Tunnel integration, Grafana-based monitoring, and gradual migration of the Klovy Systems ecosystem to fully owned hardware infrastructure.'
                }
            ]
        }
    ]
};

let currentLang = 'pl';

function setLanguage(lang) {
    currentLang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang]?.[key] !== undefined) el.innerHTML = translations[lang][key];
    });

    const dropdown = document.getElementById('langDropdown');
    const toggle   = document.getElementById('langToggle');
    const menu     = document.getElementById('langMenu');
    const label    = document.getElementById('langCurrentLabel');
    const flag     = document.getElementById('langCurrentFlag');

    if (dropdown) dropdown.classList.remove('open');
    if (toggle)   toggle.setAttribute('aria-expanded', 'false');
    if (menu)     menu.setAttribute('aria-hidden', 'true');
    if (label)    label.textContent = lang.toUpperCase();
    if (flag) {
        flag.src = lang === 'en' ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/pl.svg';
        flag.alt = lang.toUpperCase();
    }

    renderLatestPost();
}

const projectData = {
    klovy: {
        number: '01', name: 'klovy.pl',
        iconClass: 'ph-fill ph-graduation-cap', iconType: 'default',
        tags: ['Education', 'Web'], statusClass: 'done', statusKey: 'badge_done',
        link: 'https://klovy.pl', descKey: 'project_klovy_desc', dateKey: 'project_klovy_date',
    },
    chat: {
        number: '02', name: 'Klovy Chat',
        iconClass: 'ph-fill ph-chats-circle', iconType: 'chat',
        tags: ['Security', 'Messaging'], statusClass: 'wip', statusKey: 'badge_wip',
        link: 'https://klovy.chat', descKey: 'project_chat_desc', dateKey: 'project_chat_date',
    },
};

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;
    const t = translations[currentLang];

    document.getElementById('modalNumber').textContent = data.number;
    document.getElementById('modalName').textContent   = data.name;
    document.getElementById('modalDesc').textContent   = t[data.descKey] || '';

    const iconWrap = document.getElementById('modalIcon');
    iconWrap.className = 'modal-icon-wrap' + (data.iconType === 'chat' ? ' chat-icon' : '');
    iconWrap.innerHTML = `<i class="${data.iconClass}"></i>`;

    document.getElementById('modalTags').innerHTML =
        data.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');

    const dateEl = document.getElementById('modalDate');
    if (dateEl) dateEl.textContent = t[data.dateKey] || '';

    const statusEl = document.getElementById('modalStatus');
    statusEl.className = `project-status ${data.statusClass}`;
    statusEl.textContent = t[data.statusKey] || '';

    const linkBtn  = document.getElementById('modalLink');
    const linkText = document.getElementById('modalLinkText');
    linkText.textContent = t.open_project || 'Otwórz projekt';
    if (data.link) { linkBtn.href = data.link; linkBtn.style.display = 'inline-flex'; }
    else { linkBtn.style.display = 'none'; }

    openModal('projectModal');
}

function closeProjectModal(event) {
    if (event && event.target !== document.getElementById('projectModal')) return;
    closeModal('projectModal');
}

function openEcosystemModal() {
    const modal = document.getElementById('ecosystemModal');
    const descEl = modal.querySelector('[data-i18n="ecosystem_modal_desc"]');
    if (descEl) {
        const text = translations[currentLang].ecosystem_modal_desc || '';
        descEl.innerHTML = text.split('\n\n')
            .map(p => `<p style="margin-bottom:0.9rem;line-height:1.7">${p}</p>`).join('');
    }
    openModal('ecosystemModal');
}

function closeEcosystemModal(event) {
    if (event && event.target !== document.getElementById('ecosystemModal')) return;
    closeModal('ecosystemModal');
}

function openDeveloperModal() {
    const modal = document.getElementById('developerModal');
    if (!modal) return;

    modal.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang]?.[key] !== undefined) el.innerHTML = translations[currentLang][key];
    });

    const container = document.getElementById('devSections');
    if (container) {
        const sections = devSections[currentLang] || devSections.pl;
        container.innerHTML = sections.map(s => {
            const body = s.subsections
                ? s.subsections.map(sub => `<p class="dev-section-text">${sub.text}</p>`).join('')
                : `<p class="dev-section-text">${s.text}</p>`;
            return `<div class="dev-section">
                <div class="dev-section-header"><i class="${s.icon}"></i><span>${s.title}</span></div>
                ${body}
            </div>`;
        }).join('');
    }

    openModal('developerModal');
}

function closeDeveloperModal(event) {
    if (event && event.target !== document.getElementById('developerModal')) return;
    closeModal('developerModal');
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

function copyEmail() {
    const box = document.getElementById('emailBox');
    if (!box) return;
    const u = box.getAttribute('data-user');
    const d = box.getAttribute('data-domain');
    const t = box.getAttribute('data-tld');
    const email = (u && d && t) ? `${u}@${d}.${t}` : box.innerText;

    navigator.clipboard.writeText(email).catch(() => {});

    box.textContent = translations[currentLang].copied_msg || 'COPIED!';
    box.style.color = 'var(--accent)';
    setTimeout(() => { box.textContent = email; box.style.color = ''; }, 2000);
}

const POST_FILES = [
    'posts/Nazwapliku.md',
];

let loadedPosts = [];   

function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

    const yamlBlock = match[1];
    const body      = match[2];
    const meta      = {};

    yamlBlock.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return;
        const key   = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();

        if (key === 'tags') {
            const tagsRaw = value.replace(/^\[|\]$/g, '');
            meta.tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
        } else if (key === 'date') {
            meta.date = value;
        } else {
            meta[key] = value;
        }
    });

    return { meta, body };
}

function parseMarkdown(md) {
    let html = md;
    html = html.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (_, lang, code) => {
        const escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
    });

    html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm,  '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm,   '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm,    '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm,     '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm,      '<h1>$1</h1>');

    html = html.replace(/^---+$/gm, '<hr>');

    html = html.replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>');

    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:0.5rem 0;">');

    html = html.replace(/((?:^\|.+\|\r?\n)+)/gm, (tableBlock) => {
        const rows = tableBlock.trim().split('\n');
        let tableHtml = '<table>';
        rows.forEach((row, i) => {
            if (row.match(/^\|[-| :]+\|$/)) return; 
            const cells = row.split('|').slice(1, -1).map(c => c.trim());
            if (i === 0) {
                tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
            } else {
                tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
            }
        });
        tableHtml += '</tbody></table>';
        return tableHtml;
    });

    html = html.replace(/((?:^[-*+]\s.+\n?)+)/gm, (block) => {
        const items = block.trim().split('\n')
            .map(line => `<li>${line.replace(/^[-*+]\s/, '')}</li>`)
            .join('');
        return `<ul>${items}</ul>`;
    });

    html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, (block) => {
        const items = block.trim().split('\n')
            .map(line => `<li>${line.replace(/^\d+\.\s/, '')}</li>`)
            .join('');
        return `<ol>${items}</ol>`;
    });

    html = html.split('\n\n').map(block => {
        block = block.trim();
        if (!block) return '';
        if (/^<(h[1-6]|ul|ol|pre|blockquote|table|hr|img)/.test(block)) return block;
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return html;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString(currentLang === 'pl' ? 'pl-PL' : 'en-GB', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

async function loadPosts() {
    const preview = document.getElementById('latestPostPreview');
    if (preview) {
        preview.innerHTML = `<div class="latest-post-loading">
            <i class="ph-fill ph-spinner"></i>
            <span>${translations[currentLang].posts_loading || 'Ładowanie...'}</span>
        </div>`;
    }

    const results = await Promise.allSettled(
        POST_FILES.map(file =>
            fetch(file)
                .then(r => { if (!r.ok) throw new Error('not found'); return r.text(); })
                .then(text => {
                    const { meta, body } = parseFrontmatter(text);
                    return { file, meta, body };
                })
        )
    );

    loadedPosts = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
        .sort((a, b) => {
            const da = new Date(a.meta.date || '2000-01-01');
            const db = new Date(b.meta.date || '2000-01-01');
            return db - da;
        });

    renderLatestPost();
}

function renderLatestPost() {
    const preview = document.getElementById('latestPostPreview');
    const countLabel = document.getElementById('postsCountLabel');
    const t = translations[currentLang];

    if (!preview) return;

    if (loadedPosts.length === 0) {
        preview.innerHTML = `<p class="latest-post-excerpt">${t.posts_no_posts}</p>`;
        if (countLabel) countLabel.textContent = t.posts_see_all || 'Zobacz wszystkie';
        return;
    }

    const post = loadedPosts[0];
    const tags = (post.meta.tags || []).slice(0, 2);

    preview.innerHTML = `
        <div class="latest-post-card">
            <div class="latest-post-title">${escHtml(post.meta.title || '')}</div>
            <div class="latest-post-excerpt">${escHtml(post.meta.excerpt || '')}</div>
            <div class="latest-post-meta">
                <span class="latest-post-date">${formatDate(post.meta.date)}</span>
                ${tags.map(tag => `<span class="latest-post-tag">${escHtml(tag)}</span>`).join('')}
            </div>
        </div>
    `;

    if (countLabel) {
        const count = loadedPosts.length;
        countLabel.textContent = count > 1
            ? (currentLang === 'pl' ? `${count} posty — ${t.posts_see_all}` : `${count} posts — ${t.posts_see_all}`)
            : t.posts_see_all;
    }
}

function openPostsModal() {
    const container = document.getElementById('postsListContainer');
    if (!container) return;

    if (loadedPosts.length === 0) {
        container.innerHTML = `<div class="posts-list-empty">${translations[currentLang].posts_no_posts}</div>`;
    } else {
        container.innerHTML = loadedPosts.map((post, idx) => {
            const tags = (post.meta.tags || []).slice(0, 3);
            const divider = idx < loadedPosts.length - 1 ? '<div class="posts-list-divider"></div>' : '';
            return `
                <button class="post-list-item" type="button" onclick="openPostRead(${idx})">
                    <div class="post-list-icon"><i class="ph-fill ph-article"></i></div>
                    <div class="post-list-info">
                        <span class="post-list-title">${escHtml(post.meta.title || '')}</span>
                        <span class="post-list-excerpt">${escHtml(post.meta.excerpt || '')}</span>
                        <div class="post-list-meta">
                            <span class="post-list-date">${formatDate(post.meta.date)}</span>
                            ${tags.map(t => `<span class="post-list-tag">${escHtml(t)}</span>`).join('')}
                        </div>
                    </div>
                    <div class="post-list-right">
                        <i class="ph-bold ph-caret-right post-list-arrow"></i>
                    </div>
                </button>
                ${divider}
            `;
        }).join('');
    }

    openModal('postsListModal');
}

function closePostsModal(event) {
    if (event && event.target !== document.getElementById('postsListModal')) return;
    closeModal('postsListModal');
}

function openPostRead(idx) {
    const post = loadedPosts[idx];
    if (!post) return;

    document.getElementById('postReadDate').textContent  = formatDate(post.meta.date);
    document.getElementById('postReadTitle').textContent = post.meta.title || '';

    const tagsEl = document.getElementById('postReadTags');
    const tags   = post.meta.tags || [];
    tagsEl.innerHTML = tags.map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('');

    const contentEl = document.getElementById('postReadContent');
    contentEl.innerHTML = parseMarkdown(post.body);

    closeModal('postsListModal');
    openModal('postReadModal');
}

function closePostReadModal(event) {
    if (event && event.target !== document.getElementById('postReadModal')) return;
    closeModal('postReadModal');
}

function backToPostsList() {
    closeModal('postReadModal');
    openPostsModal();
}

function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}