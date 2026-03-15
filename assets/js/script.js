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
    (typeof media.addEventListener === 'function' ? media.addEventListener : media.addListener).call(media, typeof media.addEventListener === 'function' ? 'change' : fn, fn);
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
        toggle.addEventListener('click', e => { e.preventDefault(); setDropdownOpen(!dropdown.classList.contains('open')); });
        document.addEventListener('click', e => { if (!dropdown.contains(e.target)) setDropdownOpen(false); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                setDropdownOpen(false);
                closeProjectModal();
                closeEcosystemModal();
                closeDeveloperModal();
            }
        });
    }

    initParticles();
});

const translations = {
    pl: {
        hero_label: '// developer',
        hero_hint: '// kliknij aby dowiedzieć się więcej',
        hero_desc: 'Tworzę nowoczesne aplikacje webowe przy użyciu React, TypeScript i Vite. Pasjonuję się czystym kodem, wydajnością i projektami, które naprawdę mają znaczenie.',
        social_eyebrow: '// znajdź mnie',
        contact_eyebrow: '// kontakt',
        ecosystem_eyebrow: '// ecosystem',
        projects_eyebrow: '// projekty',
        projects_title: 'Projekty',
        modal_title: 'Porozmawiajmy',
        modal_desc: 'Masz projekt lub pomysł?<br>Napisz — chętnie porozmawiam.',
        project_klovy_desc: 'Edukacyjny projekt informatyczny, którego celem jest tworzenie wartościowych treści w formie poradników i instrukcji dla branży IT. Projekt obejmuje również przygotowanie materiałów edukacyjnych dla szkół na różnych poziomach nauczania – od szkół podstawowych i średnich po szkolnictwo wyższe. Celem inicjatywy jest popularyzacja wiedzy technologicznej, wspieranie rozwoju umiejętności cyfrowych oraz inspirowanie społeczności do zdobywania nowych umiejętności w dynamicznie rozwijającym się środowisku IT.',
        project_klovy_date: '2 sierpnia 2021 — 18 sierpnia 2025',
        project_chat_desc: 'Projekt nowoczesnego komunikatora internetowego opartego na nowoczesnych technologiach webowych. Odpowiada za projektowanie i wdrażanie kluczowych funkcjonalności, optymalizację wydajności aplikacji oraz zapewnienie stabilności i bezpieczeństwa systemu. Koncentruje się na zapewnieniu szybkiej, intuicyjnej i niezawodnej komunikacji w czasie rzeczywistym, kładąc nacisk na wysoką jakość doświadczenia użytkownika (UX) i skalowalność rozwiązania.',
        project_chat_date: 'Rozpoczęty 11 lutego 2025 — data premiery nieznana',
        badge_done: 'Zamkniety',
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
        developer_bio: 'Jestem entuzjastą technologii z doświadczeniem w tworzeniu oprogramowania. Obecnie kończę naukę w Zespole Szkół Zawodowych im. Marcina Rożka w Wolsztynie. Moja ścieżka zawodowa obejmuje tworzenie produktów cyfrowych i zasobów technicznych, skoncentrowanych na nowoczesnych rozwiązaniach programistycznych i architekturze systemów.\n\nJestem założycielem i liderem Klovy Systems – inicjatywy poświęconej tworzeniu innowacyjnych produktów cyfrowych, narzędzi i platform dla programistów i entuzjastów technologii. W ramach tego ekosystemu nadzoruję projektowanie i rozwój różnorodnych projektów, które działają jako samodzielne rozwiązania lub jako zintegrowane komponenty większej infrastruktury technologicznej.\n\nJednym z projektów rozwijanych w ramach Klovy Systems jest Klovy Chat, nowoczesna platforma komunikacyjna zbudowana zgodnie z naszymi autorskimi standardami infrastrukturalnymi, z naciskiem na wydajność, skalowalność, stabilność systemu i bezpieczeństwo. Model oparty na platformie, stosowany w naszym ekosystemie, umożliwia elastyczną integrację różnych usług i technologii.\n\nOprócz tworzenia oprogramowania, współtworzyłem również Klovy.pl, tworząc materiały edukacyjne i poradniki dla specjalistów IT i studentów na różnych poziomach akademickich, w celu promowania kompetencji technologicznych i praktycznej wiedzy z zakresu inżynierii oprogramowania.\n\nW Klovy Systems moim długoterminowym celem jest zbudowanie zrównoważonego ekosystemu wszechstronnych technologii, które znajdą zastosowanie w szerokim zakresie zastosowań – od codziennych narzędzi komunikacyjnych po zaawansowane rozwiązania techniczne. Nadal koncentruję się na ciągłym rozwoju, innowacjach i tworzeniu skalowalnej infrastruktury cyfrowej.\n\nSkontaktuj się ze mną, jeśli chcesz dowiedzieć się więcej.',
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
        modal_title: 'Let\'s Talk',
        modal_desc: 'Got a project or idea?<br>Reach out — I\'d love to chat.',
        project_klovy_desc: 'An educational IT project focused on creating valuable content in the form of guides and tutorials for the IT industry. The project also includes preparing educational materials for schools at various levels — from primary and secondary schools to higher education. The goal is to popularize technological knowledge, support the development of digital skills, and inspire the community to acquire new skills in the rapidly evolving IT environment.',
        project_klovy_date: 'August 2, 2021 — August 18, 2025',
        project_chat_desc: 'A project for a modern internet messenger built on cutting-edge web technologies. Responsible for designing and implementing key features, optimizing application performance, and ensuring system stability and security. Focused on delivering fast, intuitive, and reliable real-time communication with emphasis on high-quality user experience (UX) and scalability.',
        project_chat_date: 'Started February 11, 2025 — release date unknown',
        badge_done: 'Completed',
        badge_wip: 'In progress',
        ecosystem_title: 'Klovy Ecosystem',
        ecosystem_desc: 'A cohesive family of projects built under the Klovy Systems brand.',
        ecosystem_hint: '// click to learn more',
        ecosystem_modal_desc: 'Klovy Systems is a technology company developing its own digital products and solutions, focused on building a modern ecosystem of programming tools. Its activities include designing, developing and maintaining applications, platforms and services that can operate independently or as part of a larger whole.\n\nKlovy Systems operates on a "platform model" — it builds the core technology base and infrastructure within which independent projects and subsystems are created. One such project is Klovy Chat, developed as a standalone application but built on solutions and standards developed by Klovy Systems.\n\nThe goal of Klovy Systems is to build coherent, scalable and long-term solutions that can be developed in stages, added to a larger ecosystem, and used in various contexts — from everyday communication to more advanced technological applications.',
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
        developer_bio: 'I am a technology enthusiast with experience in software development. I am currently completing my education at the Marcin Rożek Vocational Schools Complex in Wolsztyn. My professional path involves creating digital products and technical resources, focused on modern software solutions and system architecture.\n\nI am the founder and leader of Klovy Systems – an initiative dedicated to creating innovative digital products, tools and platforms for developers and technology enthusiasts. Within this ecosystem, I oversee the design and development of various projects that operate as standalone solutions or as integrated components of a larger technological infrastructure.\n\nOne of the projects developed within Klovy Systems is Klovy Chat, a modern communication platform built according to our proprietary infrastructure standards, with emphasis on performance, scalability, system stability and security. The platform-based model used in our ecosystem enables flexible integration of various services and technologies.\n\nIn addition to software development, I also co-created Klovy.pl, creating educational materials and guides for IT professionals and students at various academic levels, in order to promote technological competencies and practical knowledge in software engineering.\n\nAt Klovy Systems, my long-term goal is to build a sustainable ecosystem of versatile technologies that will find application in a wide range of use cases – from everyday communication tools to advanced technical solutions. I continue to focus on continuous development, innovation and building scalable digital infrastructure.\n\nFeel free to reach out if you want to learn more.',
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
                    text: 'Posiadam doświadczenie w samodzielnym konfigurowaniu i utrzymaniu serwerów VPS. Pracowałem z platformą wirtualizacyjną Proxmox, umożliwiającą zarządzanie maszynami wirtualnymi i kontenerami. W zakresie serwerów HTTP mam praktyczne doświadczenie z NGINX, Apache oraz Caddy — konfigurowałem wirtualne hosty, przekierowania, obsługę SSL oraz reverse proxy. Do monitorowania infrastruktury i wizualizacji metryk korzystam z Grafany. W obszarze bezpieczeństwa serwerów stosuję Fail2Ban do automatycznej ochrony przed atakami brute-force oraz nieautoryzowanym dostępem. W przyszłości planuję znacząco poszerzyć swoje kompetencje w zakresie ekosystemu Cloudflare — w szczególności zamierzam wdrożyć Cloudflare R2 jako rozwiązanie do przechowywania obiektów w chmurze, stanowiące kompatybilną z protokołem S3 alternatywę dla tradycyjnych usług bucket storage. Cloudflare postrzegam jako kluczowy element nowoczesnej infrastruktury internetowej — oferuje szeroki wachlarz usług, takich jak zaawansowana ochrona DNS, CDN, zarządzanie certyfikatami SSL, Workers, Pages, tunele Cloudflare Tunnel czy reguły zapory WAF. Systematyczne poznawanie i integrowanie tych narzędzi stanowi dla mnie istotny kierunek rozwoju technicznego w nadchodzących latach.'
                },
                {
                    heading: 'WordPress',
                    text: 'Posiadam również doświadczenie w pracy z systemem zarządzania treścią WordPress. Zajmowałem się instalacją, konfiguracją oraz utrzymaniem witryn opartych na tej platformie, a także dostosowywaniem motywów i wtyczek do indywidualnych potrzeb projektów. Praktyczna znajomość WordPressa pozwala mi sprawnie realizować projekty wymagające szybkiego wdrożenia funkcjonalnego i estetycznego serwisu internetowego, bez konieczności budowania infrastruktury od podstaw.'
                },
                {
                    heading: 'Bazy danych',
                    text: 'W zakresie przechowywania i zarządzania danymi posługuję się bazami MongoDB oraz MySQL. MongoDB stosuję w projektach wymagających elastycznej struktury dokumentowej i wysokiej skalowalności, natomiast MySQL wykorzystuję w zastosowaniach opartych na relacyjnym modelu danych, gdzie kluczowa jest integralność i spójność informacji. W przyszłości planuję poszerzyć swoje kompetencje o obsługę PostgreSQL — relacyjnej bazy danych o zaawansowanych możliwościach, szeroko stosowanej w profesjonalnych środowiskach produkcyjnych. Planuję również wdrożenie Redis jako warstwy cache w rozwiązaniach wymagających wysokiej skalowalności i niskich opóźnień — przykładem takiego zastosowania jest Klovy Chat, gdzie mechanizm buforowania odgrywa istotną rolę w zapewnieniu płynnej i wydajnej komunikacji w czasie rzeczywistym.'
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
                    text: 'Muzyka stanowi istotny element mojego życia codziennego — zarówno od strony twórczej, jak i jako forma relaksu. Hobbystycznie tworzę mixy i instrumentale w FL Studio, a w przyszłości planuję rozwijać się w kierunku mashupów i remixów. Regularnie słucham muzyki różnych gatunków, ze szczególnym upodobaniem do Disco Polo, Dance oraz Pop. Chętnie sięgam też po vixy, remixy i inne aranżacje, które nadają klasycznym brzmieniom nowe życie.'
                },
                {
                    heading: 'Sport',
                    text: 'Jestem zapalonym fanem sportów zarówno letnich, jak i zimowych. Z dużym zainteresowaniem śledzę zmagania sportowców na najwyższym poziomie — wśród dyscyplin, które cenię szczególnie, znajdują się skoki narciarskie, lekkoatletyka, a także szereg innych konkurencji, w których precyzja, technika i wytrzymałość odgrywają kluczową rolę. Obserwowanie rywalizacji sportowej dostarcza mi nie tylko rozrywki, ale również inspiracji — determinacja i dążenie do doskonałości najlepszych zawodników świata motywuje mnie również w codziennej pracy twórczej.'
                },
                {
                    heading: 'Odpoczynek & świeże powietrze',
                    text: 'W wolnym czasie cenię sobie spokojny odpoczynek — lubię oglądać telewizję, przeglądać internet oraz pracować z ekosystemem Adobe: Photoshop, Illustrator i Premiere Pro. Chętnie spędzam czas na świeżym powietrzu; szczególnie upodobałem sobie okresy letnie, kiedy mogę korzystać z ciepłej pogody, opalać się i czerpać radość z przebywania na zewnątrz. Aktywny kontakt z naturą i zmiana otoczenia pozytywnie wpływają na moją koncentrację i ogólne samopoczucie.'
                },
                {
                    heading: 'Gry',
                    text: 'W wolnym czasie gram w gry wyścigowe i nie tylko — Trackmania 2 Stadium, Euro Truck Simulator 2, Forza Horizon 4, Counter-Strike 2, a sporadycznie też Fortnite, Rocket League czy Fall Guys.'
                },
                {
                    heading: 'Technologia codzienna',
                    text: 'Jestem zagorzałym fanem ekosystemu Apple — cenię jego spójność, jakość wykonania oraz płynną integrację urządzeń i usług. Filozofia projektowania Apple, stawiająca na prostotę, niezawodność i dbałość o szczegóły, jest bliska mojemu własnemu podejściu do tworzenia oprogramowania. Jeśli chodzi o platformę mobilną z systemem Android, szczególnym uznaniem darzę serię telefonów firmy Samsung. Doceniam zaawansowane możliwości techniczne tych urządzeń, staranne wykonanie oraz konsekwentny rozwój ekosystemu, który Samsung oferuje swoim użytkownikom.'
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
                    text: 'Posiadam doświadczenie w administracji zarówno systemami Linux Server, jak i Windows Server. Zdecydowanie lepiej czuję się w środowisku Linux Server — to na tej platformie realizuję zdecydowaną większość swoich projektów infrastrukturalnych. Cenię go za stabilność, elastyczność konfiguracji, wydajność oraz szerokie możliwości automatyzacji za pomocą skryptów powłoki. Windows Server znam w stopniu pozwalającym na sprawne poruszanie się w tym środowisku, jednak to Linux pozostaje moją podstawową i preferowaną platformą serwerową.'
                },
                {
                    heading: 'Serwer domowy — Dell Wyse 5070',
                    text: 'Do obsługi lekkich zadań, które nie wymagają znacznych zasobów obliczeniowych, wykorzystuję serwer domowy oparty na stacji roboczej Dell Wyse 5070. Jest to kompaktowe, energooszczędne urządzenie klasy biznesowej, pracujące całodobowo w oparciu o łącze światłowodowe o przepustowości 300/50 Mbps.'
                },
                {
                    heading: 'Zastosowania serwera domowego',
                    text: 'Na serwerze domowym hostuję przede wszystkim boty Discord tworzone i utrzymywane na potrzeby działalności Klovy Systems — działają one nieprzerwanie jako usługi systemowe, obsługując automatyzacje, powiadomienia oraz funkcje wspierające społeczność. Serwer pełni również rolę centralnego repozytorium plików w oparciu o system CasaOS — intuicyjną platformę chmury prywatnej, umożliwiającą wygodne przechowywanie i organizację plików projektowych, zasobów graficznych, kopii zapasowych oraz dokumentacji technicznej. Uruchamiam na nim również lżejsze skrypty i usługi pomocnicze, których wymagania sprzętowe nie uzasadniają korzystania z płatnej infrastruktury zewnętrznej.'
                },
                {
                    heading: 'Serwery VPS i dedykowane — zadania produkcyjne',
                    text: 'W przypadku projektów wymagających większej mocy obliczeniowej, niezawodności na poziomie produkcyjnym lub stałego adresu IP o wysokiej dostępności, korzystam z serwerów VPS bądź serwerów dedykowanych — w zależności od skali i charakteru danego zadania. Przy mniejszych obciążeniach produkcyjnych wystarczający jest serwer VPS, natomiast projekty o znacznie wyższych wymaganiach sprzętowych lub potrzebie pełnej izolacji zasobów kieruję na infrastrukturę dedykowaną. To właśnie na tej infrastrukturze osadzam bardziej wymagające usługi — takie jak Klovy Chat, czyli rozwijana przeze mnie platforma komunikacyjna, czy inne komponenty ekosystemu Klovy Systems wymagające stabilnego i skalowalnego środowiska uruchomieniowego.'
                },
                {
                    heading: 'Filozofia podziału infrastruktury',
                    text: 'Świadome rozgraniczenie między infrastrukturą lokalną a chmurową pozwala mi optymalizować koszty utrzymania projektów przy jednoczesnym zachowaniu odpowiedniego poziomu wydajności i niezawodności dla każdego z nich. Takie podejście traktuję jako element dojrzałego myślenia o architekturze systemów — dobierając środowisko uruchomieniowe adekwatnie do rzeczywistych potrzeb danego projektu.'
                },
                {
                    heading: 'Plany rozwoju',
                    text: 'W przyszłości planuję rozbudować infrastrukturę o integrację z Cloudflare Tunnel w celu bezpiecznego zdalnego dostępu do zasobów lokalnych, wdrożenie systemu monitorowania opartego na Grafanie oraz stopniowe przenoszenie kolejnych elementów ekosystemu Klovy Systems na własną, w pełni kontrolowaną infrastrukturę sprzętową.'
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
                    text: 'I live with autism spectrum disorder, diagnosed in early childhood at around the age of three. It is an integral part of my personality and shapes, to a significant extent, the way I perceive the world and approach my work. I am characterised by a strong focus on detail, an analytical way of thinking, and a deep passion for the areas I am interested in — qualities which, in the context of software development, translate into a careful, deliberate and consistent approach to building software.'
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
                    text: 'I have hands-on experience configuring and maintaining VPS servers independently. I have worked with the Proxmox virtualisation platform for managing virtual machines and containers. In terms of HTTP servers, I have practical experience with NGINX, Apache and Caddy — configuring virtual hosts, redirects, SSL handling and reverse proxying. I use Grafana for infrastructure monitoring and metrics visualisation. For server security, I apply Fail2Ban to provide automated protection against brute-force attacks and unauthorised access attempts. Looking ahead, I plan to significantly broaden my competencies across the Cloudflare ecosystem — in particular, I intend to implement Cloudflare R2 as an object storage solution, providing an S3-compatible alternative to traditional bucket storage services. I view Cloudflare as a key component of modern web infrastructure, offering a comprehensive suite of services including advanced DNS protection, CDN, SSL certificate management, Workers, Pages, Cloudflare Tunnel and WAF firewall rules. Systematically learning and integrating these tools represents an important direction of my technical development in the coming years.'
                },
                {
                    heading: 'WordPress',
                    text: 'I also have experience working with the WordPress content management system. I have been involved in the installation, configuration and maintenance of WordPress-based websites, as well as customising themes and plugins to meet the specific requirements of individual projects. My practical knowledge of WordPress allows me to efficiently deliver projects that require the rapid deployment of a functional and visually polished website, without the need to build the entire infrastructure from scratch.'
                },
                {
                    heading: 'Databases',
                    text: 'In the area of data storage and management, I work with MongoDB and MySQL. I use MongoDB in projects that require a flexible document-based structure and high scalability, while MySQL serves me in applications built on a relational data model where data integrity and consistency are of primary importance. In the future, I plan to expand my competencies to include PostgreSQL — a powerful relational database system widely used in professional production environments. I also intend to implement Redis as a caching layer in solutions that demand high scalability and low latency — a prime example of such an application is Klovy Chat, where a caching mechanism plays a significant role in ensuring smooth and efficient real-time communication.'
                },
                {
                    heading: 'Work style & collaboration',
                    text: 'I usually work on projects independently, but I value teamwork — many endeavours would not be possible without the help of others. I do not yet hold formal certifications, but I plan to obtain them after finishing school to formally confirm my skills.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-buildings',
            title: 'Klovy Systems',
            subsections: [
                {
                    heading: 'Origin and mission',
                    text: 'I am the founder and leader of Klovy Systems — an initiative dedicated to creating innovative digital products, tools and platforms for developers and technology enthusiasts. The initiative was born from the need for a cohesive brand under which the various technology projects I develop with real-world application in mind could operate.'
                },
                {
                    heading: 'Platform model',
                    text: 'Within the ecosystem, I oversee the design and development of projects that function both as standalone solutions and as integrated components of a larger infrastructure. Klovy Systems operates on a platform model — building a shared technology base, standards and infrastructure upon which subsequent projects are created, such as Klovy Chat.'
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
                    text: 'I am currently completing my education at the Marcin Rożek Vocational Schools Complex in Wolsztyn, in the IT technician programme. The practical skills acquired through my formal education serve as a solid complement to the knowledge I develop independently through my own projects.'
                },
                {
                    heading: 'Academic plans',
                    text: 'In the future, I plan to pursue studies in cybersecurity — a field that combines my interest in system security with my professional ambitions. My goal is to earn an engineering degree, followed by a master\'s degree if the opportunity arises.'
                },
                {
                    heading: 'Extracurricular activity',
                    text: 'During my education I have had the opportunity to participate in various school initiatives. In 2023 I took part in a graphic design competition, creating a logo for the Wolsztyn Engine Shed, and also participated in a young literary talents contest — allowing me to develop my creativity outside the technical domain as well.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-music-note',
            title: 'Beyond the code',
            subsections: [
                {
                    heading: 'Music',
                    text: 'Music plays a significant role in my everyday life — both as a creative outlet and as a form of relaxation. As a hobby, I create mixes and instrumentals in FL Studio, and I plan to expand into mashups and remixes in the future. I regularly listen to a wide range of music, with a particular fondness for Disco Polo, Dance and Pop. I also enjoy vixes, remixes and other reworkings that breathe new life into familiar sounds.'
                },
                {
                    heading: 'Sport',
                    text: 'I am a passionate fan of both summer and winter sports. I follow athletic competitions at the highest level with great interest — among the disciplines I particularly appreciate are ski jumping, athletics, and a number of other events in which precision, technique and endurance play a decisive role. Watching sporting competition provides me not only with entertainment, but also with inspiration — the determination and pursuit of excellence displayed by the world\'s finest athletes motivates me in my own creative work as well.'
                },
                {
                    heading: 'Rest & the outdoors',
                    text: 'In my free time, I value peaceful rest — I enjoy watching television, browsing the internet and working within the Adobe ecosystem: Photoshop, Illustrator and Premiere Pro. I am also very fond of spending time outdoors; I particularly enjoy the summer months, when I can make the most of warm weather, sunbathe and take pleasure in being outside. Spending time in the open air and changing my surroundings has a positive effect on my focus and overall well-being.'
                },
                {
                    heading: 'Gaming',
                    text: 'In my free time I enjoy playing games — Trackmania 2 Stadium, Euro Truck Simulator 2, Forza Horizon 4, Counter-Strike 2, and occasionally Fortnite, Rocket League or Fall Guys.'
                },
                {
                    heading: 'Everyday technology',
                    text: 'I am an avid enthusiast of the Apple ecosystem, which I value for its cohesion, build quality and seamless integration of devices and services. Apple\'s design philosophy — centred around simplicity, reliability and meticulous attention to detail — closely aligns with my own approach to software development. Regarding the Android platform, I have a particular appreciation for Samsung\'s smartphone lineup. I admire the advanced technical capabilities, refined build quality and the consistent development of the ecosystem that Samsung delivers to its users.'
                }
            ]
        },
        {
            icon: 'ph-fill ph-gear',
            title: 'Work style',
            subsections: [
                {
                    heading: 'Approach',
                    text: 'I prefer a calm and thorough approach to work — I firmly believe that rushing leads to mistakes, and that fixing them afterwards takes far more time than doing the job carefully from the outset. I aim to complete projects in a thoughtful and polished way, giving proper attention to every stage of the creative process.'
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
                    text: 'I have experience administering both Linux Server and Windows Server environments. I am significantly more proficient in Linux Server — it is the platform on which I carry out the vast majority of my infrastructure projects. I value it for its stability, configuration flexibility, performance and extensive automation capabilities through shell scripting. I am familiar with Windows Server to a degree that allows me to navigate that environment competently, however Linux remains my primary and preferred server platform.'
                },
                {
                    heading: 'Home server — Dell Wyse 5070',
                    text: 'For lightweight tasks that do not require significant computational resources, I operate a home server based on a Dell Wyse 5070 workstation. It is a compact, energy-efficient business-class device running around the clock on a fibre-optic connection with a bandwidth of 300/50 Mbps.'
                },
                {
                    heading: 'Home server use cases',
                    text: 'On the home server, I primarily host Discord bots created and maintained for Klovy Systems operations — they run continuously as system services, handling automations, notifications and functions supporting the community. The server also acts as a central file repository powered by CasaOS — an intuitive private cloud platform enabling convenient storage and organisation of project files, graphic assets, backups and technical documentation. I also run lighter scripts and auxiliary services whose hardware requirements do not justify the use of paid external infrastructure.'
                },
                {
                    heading: 'VPS and dedicated servers — production workloads',
                    text: 'For projects requiring greater computing power, production-level reliability or a highly available static IP address, I use VPS or dedicated servers — depending on the scale and nature of the given task. For smaller production workloads a VPS is sufficient, while projects with significantly higher hardware requirements or a need for full resource isolation are directed to dedicated infrastructure. This is where I deploy more demanding services — such as Klovy Chat, the communication platform I am developing, and other components of the Klovy Systems ecosystem that require a stable and scalable runtime environment.'
                },
                {
                    heading: 'Infrastructure division philosophy',
                    text: 'The deliberate separation between local and cloud infrastructure allows me to optimise the operational costs of my projects while maintaining an appropriate level of performance and reliability for each of them. I treat this approach as an element of mature systems architecture thinking — selecting the runtime environment that is genuinely suited to the actual needs of each project.'
                },
                {
                    heading: 'Development plans',
                    text: 'In the future, I plan to expand the infrastructure with Cloudflare Tunnel integration for secure remote access to local resources, deployment of a Grafana-based monitoring system, and the gradual migration of further components of the Klovy Systems ecosystem to a fully owned and controlled hardware infrastructure.'
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
    const toggle = document.getElementById('langToggle');
    const menu = document.getElementById('langMenu');
    const label = document.getElementById('langCurrentLabel');
    const flag  = document.getElementById('langCurrentFlag');

    if (dropdown) dropdown.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (menu) menu.setAttribute('aria-hidden', 'true');
    if (label) label.textContent = lang.toUpperCase();
    if (flag) {
        flag.src = lang === 'en' ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/pl.svg';
        flag.alt = lang.toUpperCase();
    }
}

const projectData = {
    klovy: {
        number: '01',
        name: 'klovy.pl',
        iconClass: 'ph-fill ph-graduation-cap',
        iconType: 'default',
        tags: ['Education', 'Web'],
        statusClass: 'done',
        statusKey: 'badge_done',
        link: 'https://klovy.pl',
        descKey: 'project_klovy_desc',
        dateKey: 'project_klovy_date',
    },
    chat: {
        number: '02',
        name: 'Klovy Chat',
        iconClass: 'ph-fill ph-chats-circle',
        iconType: 'chat',
        tags: ['Security', 'Messaging'],
        statusClass: 'wip',
        statusKey: 'badge_wip',
        link: 'https://klovy.chat',
        descKey: 'project_chat_desc',
        dateKey: 'project_chat_date',
    },
};

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    const t = translations[currentLang];

    document.getElementById('modalNumber').textContent = data.number;
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalDesc').textContent = t[data.descKey] || '';

    const iconWrap = document.getElementById('modalIcon');
    iconWrap.className = 'modal-icon-wrap' + (data.iconType === 'chat' ? ' chat-icon' : '');
    iconWrap.innerHTML = `<i class="${data.iconClass}"></i>`;

    const tagsEl = document.getElementById('modalTags');
    tagsEl.innerHTML = data.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');

    const dateEl = document.getElementById('modalDate');
    if (dateEl) dateEl.textContent = t[data.dateKey] || '';

    const statusEl = document.getElementById('modalStatus');
    statusEl.className = `project-status ${data.statusClass}`;
    statusEl.textContent = t[data.statusKey] || '';

    const linkBtn  = document.getElementById('modalLink');
    const linkText = document.getElementById('modalLinkText');
    linkText.textContent = t.open_project || 'Otwórz projekt';
    if (data.link) {
        linkBtn.href = data.link;
        linkBtn.style.display = 'inline-flex';
    } else {
        linkBtn.style.display = 'none';
    }

    const modal = document.getElementById('projectModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function closeProjectModal(event) {
    if (event && event.target !== document.getElementById('projectModal')) return;
    const modal = document.getElementById('projectModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
}

function openEcosystemModal() {
    const modal = document.getElementById('ecosystemModal');
    const descEl = modal.querySelector('[data-i18n="ecosystem_modal_desc"]');
    if (descEl) {
        const text = translations[currentLang].ecosystem_modal_desc || '';
        descEl.innerHTML = text.split('\n\n').map(p => `<p style="margin-bottom:0.9rem;line-height:1.7">${p}</p>`).join('');
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function closeEcosystemModal(event) {
    if (event && event.target !== document.getElementById('ecosystemModal')) return;
    const modal = document.getElementById('ecosystemModal');
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
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
                ? s.subsections.map(sub => `
                    <p class="dev-section-text">${sub.text}</p>`).join('')
                : `<p class="dev-section-text">${s.text}</p>`;
            return `
            <div class="dev-section">
                <div class="dev-section-header">
                    <i class="${s.icon}"></i>
                    <span>${s.title}</span>
                </div>
                ${body}
            </div>`;
        }).join('');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function closeDeveloperModal(event) {
    if (event && event.target !== document.getElementById('developerModal')) return;
    const modal = document.getElementById('developerModal');
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

    setTimeout(() => {
        box.textContent = email;
        box.style.color = '';
    }, 2000);
}