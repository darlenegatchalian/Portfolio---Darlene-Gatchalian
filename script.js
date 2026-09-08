document.addEventListener("DOMContentLoaded", () => {

/* MOBILE NAVIGATION */

    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle && navLinks) {
        const desktopBreakpoint = 800;
        function setMenuOpen(isOpen) {
            navLinks.classList.toggle("is-open", isOpen);
            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Close menu" : "Open menu"
            );
        }

        navToggle.addEventListener("click", () => {
            const currentlyOpen =
                navLinks.classList.contains("is-open");
            setMenuOpen(!currentlyOpen);
        });

        /* CLOSE MENU AFTER CLICKING A LINK */
        navLinks.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                setMenuOpen(false);
            }
        });

        /* CLOSE MENU WHEN RETURNING TO DESKTOP */
        window.addEventListener("resize", () => {
            if (window.innerWidth >= desktopBreakpoint) {
                setMenuOpen(false);
            }
        });
    }

/* SCROLL REVEAL */
    const revealItems =
        document.querySelectorAll(".reveal");
    if (revealItems.length) {
        if (!("IntersectionObserver" in window)) {
            revealItems.forEach((item) => {
                item.classList.add("is-visible");
            });
        }
        else {
            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) {
                                return;
                            }
                            const item =
                                entry.target;

                            /* Read animation delay from HTML */
                            const delay =
                                Number(
                                    item.dataset.delay || 0
                                );
                            item.style.transitionDelay =
                                `${delay}ms`;

                            item.classList.add(
                                "is-visible"
                            );
                            /* Animate only once */
                            observer.unobserve(item);
                        });
                    },
                    {
                        threshold: 0.12,
                        rootMargin:
                            "0px 0px -40px 0px"
                    }
                );
            revealItems.forEach((item) => {
                revealObserver.observe(item);
            });
        }
    }



/* EDUCATION PATHWAY */
    const educationPath =
        document.getElementById("eduPath");
    const pathProgress =
        document.getElementById("pathProgress");
    const educationItems =
        educationPath
            ? educationPath.querySelectorAll(".path-item")
            : [];
    if (
        educationPath &&
        pathProgress &&
        educationItems.length
    ) {
        /* Controls where the progress line reacts */
        const progressTrigger = 0.75;

        /* Controls when education cards activate */
        const itemTrigger = 0.83;

        function updateEducationPath() {
            const rect =
                educationPath.getBoundingClientRect();
            const triggerPoint =
                window.innerHeight *
                progressTrigger;
            let progress =
                (
                    (triggerPoint - rect.top) /
                    rect.height
                ) * 100;
            /* Keep progress between 0 and 100 */
            progress =
                Math.max(
                    0,
                    Math.min(100, progress)
                );

            pathProgress.style.height =
                `${progress}%`;

            /* Activate education cards */
            educationItems.forEach((item) => {
                const itemRect =
                    item.getBoundingClientRect();
                const isActive =
                    itemRect.top <
                    window.innerHeight *
                    itemTrigger;
                item.classList.toggle(
                    "is-active",
                    isActive
                );
            });
        }

        /* Run immediately */
        updateEducationPath();

        /* Update while scrolling */
        window.addEventListener(
            "scroll",
            updateEducationPath,
            { passive: true }
        );

        /* Update when browser is resized */
        window.addEventListener(
            "resize",
            updateEducationPath
        );

        /* Update after images finish loading */
        window.addEventListener(
            "load",
            updateEducationPath
        );
    }

    /* ACTIVE NAVIGATION */
    const sections =
        [
            ...document.querySelectorAll(
                "main section[id]"
            )
        ];
    const navigationLinks =
        [
            ...document.querySelectorAll(
                ".nav-links a[href^='#']"
            )
        ];
    if (
        sections.length &&
        navigationLinks.length
    ) {
        function setCurrentNavigation(sectionId) {
            navigationLinks.forEach((link) => {
                link.classList.toggle(
                    "is-current",
                    link.getAttribute("href") ===
                    `#${sectionId}`
                );
            });
        }

        /* Observe sections while scrolling */
        const navObserver =
            new IntersectionObserver(
                (entries) => {
                    const visibleSections =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (a, b) =>
                                    Math.abs(
                                        a.boundingClientRect.top
                                    ) -
                                    Math.abs(
                                        b.boundingClientRect.top
                                    )
                            );
                    if (visibleSections.length) {

                        setCurrentNavigation(
                            visibleSections[0]
                                .target
                                .id
                        );
                    }
                },
                {
                    threshold: 0.2,
                    rootMargin:
                        "-15% 0px -60% 0px"
                }
            );
        sections.forEach((section) => {
            navObserver.observe(section);
        });
        /* Update active link immediately when clicked */
        navigationLinks.forEach((link) => {
            link.addEventListener(
                "click",
                () => {
                    const sectionId =
                        link
                            .getAttribute("href")
                            .slice(1);
                    setCurrentNavigation(
                        sectionId
                    );
                }
            );
        });
    }
    /* EXPERIENCE IMAGE SLIDER */

function setupExperienceSlider(
    mediaId,
    buttonSelector,
    fallbackCaption
) {

    const mediaContainer =
        document.getElementById(mediaId);

    if (!mediaContainer) {
        return;
    }

    /* Find the experience card containing this media */
    const experienceCard =
        mediaContainer.closest(".experience-card");

    if (!experienceCard) {
        return;
    }

    /* Find image and button ONLY inside this experience */
    const experienceImage =
        experienceCard.querySelector(
            ".experience-media img"
        );

    const experienceButton =
        experienceCard.querySelector(
            buttonSelector
        );

    if (!experienceImage || !experienceButton) {
        return;
    }

    /* Get all images for this experience */
    const mediaItems = [
        ...mediaContainer.querySelectorAll(
            "span[data-src]"
        )
    ];

    let currentIndex = 0;

    /* Find the image currently displayed */
    const initialSource =
        experienceImage.getAttribute("src");

    const initialIndex =
        mediaItems.findIndex(
            (item) =>
                item.dataset.src ===
                initialSource
        );

    if (initialIndex >= 0) {
        currentIndex = initialIndex;
    }

    /* Image transition */
    experienceImage.style.transition =
        "opacity .2s ease";

    /* NEXT IMAGE */

    experienceButton.addEventListener(
        "click",
        () => {

            if (!mediaItems.length) {
                return;
            }

            /* Move to next image */
            currentIndex =
                (currentIndex + 1) %
                mediaItems.length;

            const nextItem =
                mediaItems[currentIndex];

            const nextSource =
                nextItem.dataset.src;

            const nextCaption =
                nextItem.dataset.caption ||
                fallbackCaption;

            /* Fade out */
            experienceImage.style.opacity = "0";

            window.setTimeout(
                () => {

                    experienceImage.src =
                        nextSource;

                    experienceImage.alt =
                        nextCaption;

                    /* Fade in */
                    experienceImage.style.opacity = "1";

                },
                180
            );
        }
    );
}


/* EXPERIENCE 01 FREELANCE GRAPHIC DESIGNER*/
setupExperienceSlider(
    "freelanceMedia",
    ".freelance-media-next",
    "Graphic design work"
);

/* EXPERIENCE 02 IT SUPPORT INTERN */
setupExperienceSlider(
    "internMedia",
    ".media-next",
    "Internship experience"
);

/* PROJECT FILES */
const PROJECT_FILES = {
    gatchysweets:[
        {
            src: "Projects/GatchySweets/GatchySweetsHome.png",
            title: "GatchySweets — Home",
            type: "image",
            mode: "web"
        },
        {
            src: "Projects/GatchySweets/GatchySweetsAboutUs.png",
            title: "GatchySweets — About Us",
            type: "image",
             mode: "web"
        },
        {
            src: "Projects/GatchySweets/GatchySweetsProducts.png",
            title: "GatchySweets — Products",
            type: "image",
            mode: "web"
        },
        {
            src: "Projects/GatchySweets/GatchySweetsContact.png",
            title: "GatchySweets — Contact",
            type: "image",
            mode: "web"
        }
    ],

    iparam: [
         {
            src: "Projects/Iparam/IParamLoading.png",
            title: "IParam — Loading Screen",
            type: "image",
            mode: "mobile"
        },
        {
           src: "Projects/Iparam/IParamLogin.png",
            title: "IParam — Login",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Iparam/IParamReserve.png",
            title: "IParam — Reserve",                
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Iparam/IParamProfile.png",
            title: "IParam — Profile",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Iparam/IPARAM.png",
            title: "Iparam Lean Canvas",
            type: "image",
            mode: "digital"
        }
    ],

    GVHotel:[
        {
            src: "Projects/GVHotel/GVHotelHome.png",
            title: "GV HOTEL — Home",
            type: "image",                
            mode: "web"
        },
        {
            src: "Projects/GVHotel/GVHotelAboutUs.png",
            title: "GV HOTEL — About",
            type: "image",                
            mode: "web"
        },
        {
            src: "Projects/GVHotel/GVHotel.png",
            title: "GV HOTEL — Hotels",                
            type: "image",
            mode: "web"
        },
        {
            src: "Projects/GVHotel/GVHotelLogin.png",
            title: "GV HOTEL — Login",
            type: "image",                
            mode: "web"
        }
    ],

    solarcool: [
        {
            src: "Projects/Solarcool Umbrella/Solarcool Umbrella.png",
            title: "Solarcool Umbrella Prototype",
            type: "image",
            mode: "digital"
        }
    ],

    consultease: [
        {
            src: "Projects/Consultease/ConsulteaseLoading.jpg",
            title: "ConsultEase — Loading Screen",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsultEaseLogin.jpg",
            title: "ConsultEase — Login",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsulteaseAnalyticsDashboard.jpg",
            title: "ConsultEase — Dashboard",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsulteaseDeanUI.jpg",
            title: "ConsultEase — Dean UI",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsulteaseProgCoorUI.jpg",
            title: "ConsultEase — Program Coordinator UI",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsulteaseFacultyUI.jpg",
            title: "ConsultEase — Faculty UI",
            type: "image",
            mode: "mobile"
        },
        {
            src: "Projects/Consultease/ConsulteaseStudentUI.jpg",
            title: "ConsultEase — Student UI",
            type: "image",
            mode: "mobile"
        }
    ]
};
document.querySelectorAll("[data-project]").forEach(button => {
    button.addEventListener("click", () => {
        const project = button.dataset.project;
        const files = PROJECT_FILES[project];
        if (!files || !files.length) {
            console.warn("Project files not found:", project);
            return;
        }
        openViewer(
            files,
            0,
            files[0].mode || "digital"
        );
    });
});

/* DESIGN ALBUMS */
const DESIGN_ALBUMS = {

    /* WEBSITE PROJECT 1 */
    website1: {
        title: "GV HOTEL BOOKING",
        mode: "web",
        files: [
            {
                src: "Projects/GVHotel/GVHotelHome.png",
                title: "GV HOTEL — Home",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GVHotel/GVHotelAboutUs.png",
                title: "GV HOTEL — About",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GVHotel/GVHotel.png",
                title: "GV HOTEL — Hotels",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GVHotel/GVHotelLogin.png",
                title: "GV HOTEL — Login",
                type: "image",
                mode: "web"
            }
        ]
    },
    /* WEBSITE PROJECT 2 */
    website2: {
        title: "GatchySweets",
        mode: "web",
        files: [
            {
                src: "Projects/GatchySweets/GatchySweetsHome.png",
                title: "GatchySweets — Home",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GatchySweets/GatchySweetsAboutUs.png",
                title: "GatchySweets — About Us",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GatchySweets/GatchySweetsProducts.png",
                title: "GatchySweets — Products",
                type: "image",
                mode: "web"
            },
            {
                src: "Projects/GatchySweets/GatchySweetsContact.png",
                title: "GatchySweets — Contact",
                type: "image",
                mode: "web"
            }
        ]
    },

    /* MOBILE PROJECT 1 */
    mobile1: {
        title: "IParam",
        mode: "mobile",
        files: [
            {
                src: "Projects/Iparam/IParamLoading.png",
                title: "IParam — Loading Screen",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Iparam/IParamLogin.png",
                title: "IParam — Login",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Iparam/IParamReserve.png",
                title: "IParam — Reserve",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Iparam/IParamProfile.png",
                title: "IParam — Profile",
                type: "image",
                mode: "mobile"
            }
        ]
    },

    /* MOBILE PROJECT 2 */
    mobile2: {
        title: "ConsultEase",
        mode: "mobile",
        files: [
            {
                src: "Projects/Consultease/ConsulteaseLoading.jpg",
                title: "ConsultEase — Loading Screen",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsultEaseLogin.jpg",
                title: "ConsultEase — Login",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsulteaseAnalyticsDashboard.jpg",
                title: "ConsultEase — Dashboard",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsulteaseDeanUI.jpg",
                title: "ConsultEase — Dean UI",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsulteaseProgCoorUI.jpg",
                title: "ConsultEase — Program Coordinator UI",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsulteaseFacultyUI.jpg",
                title: "ConsultEase — Faculty UI",
                type: "image",
                mode: "mobile"
            },
            {
                src: "Projects/Consultease/ConsulteaseStudentUI.jpg",
                title: "ConsultEase — Student UI",
                type: "image",
                mode: "mobile"
            }
        ]
    },

    /* LOGOS */
    logos: {
        title: "Logo Designs",
        mode: "digital",
        files: [
            {
                src: "Designs/LOGO/GS-LOGO.png",
                title: "Gatchysweets Logo",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/LOGO/IP-LOGO.jpg",
                title: "IParam Logo",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/LOGO/GV-LOGO.png",
                title: "GV Hotel Booking Logo",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/LOGO/H-Logo.jpg",
                title: "Helionest Logo",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/LOGO/C-LOGO.jpg",
                title: "ConsultEase Logo",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/LOGO/CQ-LOGO.jpg",
                title: "Chip Quest Loggo",
                type: "image",
                mode: "digital"
            }
        ]
    },
    /* DIGITAL ARTS */
    art: {
        title: "Digital Arts",
        mode: "digital",
        files: [
            {
                src: "Designs/Digital Arts/Calling Card.jpg",
                title: "Calling Card",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/DstrkcloCallingCard1.png",
                title: "DSTRKCLO Calling Card 1",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/DstrkcloCallingCard2.png",
                title: "DSTRKCLO Calling Card 2",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/Banner.jpg",
                title: "Banner",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/Wedding Invitation.png",
                title: "Wedding Invitation",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/Christening Invitation.jpg",
                title: "Christening Invitation",
                type: "image",
                mode: "digital"
            },
            {
                src: "Designs/Digital Arts/Recreation.jpg",
                title: "Digital Art Recreation",
                type: "image",
                mode: "digital"
            }
        ]
    }
};

/* VIEWER ELEMENTS */
const viewer =
    document.getElementById("viewer");
const viewerContent =
    document.getElementById("viewerContent");
const viewerTitle =
    document.getElementById("viewerTitle");
const viewerCounter =
    document.getElementById("viewerCounter");
const viewerMode =
    document.getElementById("viewerMode");
const viewerClose =
    document.getElementById("viewerClose");
const viewerPrev =
    document.getElementById("viewerPrev");
const viewerNext =
    document.getElementById("viewerNext");


/* ALBUM ELEMENTS */
const albumModal =
    document.getElementById("albumModal");
const albumGrid =
    document.getElementById("albumGrid");
const albumTitle =
    document.getElementById("albumTitle");
const albumClose =
    document.getElementById("albumClose");


/* VIEWER STATE */
let currentItems = [];
let currentIndex = 0;
let currentMode = "digital";

/* FILE TYPE DETECTION */
function detectType(src) {
    const file =
        src.toLowerCase();
    if (
        file.endsWith(".mp4") ||
        file.endsWith(".webm") ||
        file.endsWith(".ogg") ||
        file.endsWith(".mov")
    ) {
        return "video";
    }
    if (file.endsWith(".pdf")) {
        return "pdf";
    }
    return "image";
}

/* CREATE IMAGE*/
function createImage(src, alt = "") {
    const image =
        document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.draggable = false;
    image.loading = "eager";
    return image;
}

/* WEB BROWSER VIEW */
function renderBrowser(item) {
    const browser =
        document.createElement("div");
    browser.className =
        "mock-browser";
    browser.innerHTML = `
        <div class="browser-top">
            <div class="browser-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="browser-tabs">
                <div class="browser-tab active">
                    ${item.title || "Website Preview"}
                </div>
                <div class="browser-tab">
                    +
                </div>
            </div>
        </div>

        <div class="browser-toolbar">
            <button type="button">
                ←
            </button>
            <button type="button">
                →
            </button>
            <button type="button">
                ↻
            </button>
            <div class="browser-address">
                portfolio.local / preview
            </div>
            <button type="button">
                ⋮
            </button>
        </div>
        <div class="browser-page"></div>
    `;

    const page =
        browser.querySelector(
            ".browser-page"
        );
    page.appendChild(
        createImage(
            item.src,
            item.title
        )
    );
    viewerContent.appendChild(
        browser
    );
}

/* MOBILE PHONE VIEW */
function renderPhone(item) {
    const phone =
        document.createElement("div");
    phone.className =
        "mock-phone";
    phone.innerHTML = `
        <div class="phone-speaker"></div>
        <div class="phone-screen"></div>
        <div class="phone-home"></div>
    `;
    const screen =
        phone.querySelector(
            ".phone-screen"
        );
    screen.appendChild(
        createImage(
            item.src,
            item.title
        )
    );
    viewerContent.appendChild(
        phone
    );
}

/* DIGITAL EDITOR VIEW */
function renderDigital(item) {
    const editor =
        document.createElement("div");
    editor.className =
        "mock-editor";
    editor.innerHTML = `
        <div class="editor-top">
            <div class="editor-brand">
                DESIGNER
            </div>
            <div class="editor-menu">
                File&nbsp;&nbsp;
                Edit&nbsp;&nbsp;
                Image&nbsp;&nbsp;
                Layer&nbsp;&nbsp;
                View
            </div>
            <div class="editor-actions">
                − &nbsp; □ &nbsp; ×
            </div>
        </div>

        <div class="editor-toolbar">
            <span>Move</span>
            <span>Crop</span>
            <span>Brush</span>
            <span>Text</span>
            <span>Shape</span>
        </div>

        <div class="editor-body">
            <aside class="editor-tools">
                <span>✦</span>
                <span>□</span>
                <span>◯</span>
                <span>✎</span>
                <span>T</span>
                <span>⌁</span>
            </aside>

            <div class="editor-canvas">
                <div class="canvas-inner"></div>
            </div>

            <aside class="editor-panel">
                <strong>LAYERS</strong>
                <div class="editor-layer">
                    ${item.title || "Design"}
                </div>
                <div class="editor-layer">
                    Background
                </div>
                <hr>
                <strong>PROPERTIES</strong>
                <p>Width: Auto</p>
                <p>Height: Auto</p>
                <p>Scale: Fit</p>
            </aside>
        </div>
    `;

    const canvas =
        editor.querySelector(
            ".canvas-inner"
        );
    canvas.appendChild(
        createImage(
            item.src,
            item.title
        )
    );
    viewerContent.appendChild(
        editor
    );
}


/* VIDEO VIEW */

function renderVideo(item) {
    const wrapper =
        document.createElement("div");
    wrapper.className =
        "mock-video";
    const video =
        document.createElement("video");
    video.src =
        item.src;
    video.controls = true;
    video.controlsList =
        "nodownload noremoteplayback";
    video.disablePictureInPicture =
        true;
    video.playsInline = true;
    video.preload =
        "metadata";

    wrapper.appendChild(video);
    viewerContent.appendChild(
        wrapper
    );
}

/*  PDF VIEW */

function renderPDF(item) {
    const iframe =
        document.createElement("iframe");
    iframe.className =
        "mock-pdf";
    iframe.src =
        `${item.src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    iframe.title =
        item.title || "PDF Preview";
    viewerContent.appendChild(
        iframe
    );
}

/* RENDER CURRENT FILE */

function renderCurrent() {
    if (!currentItems.length) {
        return;
    }
    const item =
        currentItems[currentIndex];
    viewerContent.replaceChildren();
    const type =
        item.type ||
        detectType(item.src);
    const mode =
        item.mode ||
        currentMode;
    viewerTitle.textContent =
        item.title ||
        "Portfolio Preview";
    viewerCounter.textContent =
        currentItems.length > 1
        ? `${currentIndex + 1} / ${currentItems.length}`
        : "";
    /* VIEWER LABEL */
    if (type === "video") {
        viewerMode.textContent =
            "VIDEO";
    }
    else if (type === "pdf") {
        viewerMode.textContent =
            "DOCUMENT";
    }

    else if (mode === "web") {
        viewerMode.textContent =
            "WEB PREVIEW";
    }

    else if (mode === "mobile") {
        viewerMode.textContent =
            "MOBILE PREVIEW";
    }

    else {
        viewerMode.textContent =
            "DIGITAL PREVIEW";
    }


/* SELECT VIEWER */
if (
    mode === "image" ||
    (mode === "certificate" && type === "image")
) {
    const img =
        document.createElement("img");
    img.src =
        item.src;
    img.alt =
        item.title ||
        "Image Preview";
    img.className =
        "plain-view-image";
    img.draggable =
        false;
    viewerContent.appendChild(img);
}

/* Certificate PDF */
else if (
    mode === "certificate" &&
    type === "pdf"
) {
    renderPDF(item);
}

/* Video */
else if (type === "video") {
    renderVideo(item);
}

/* PDF */
else if (type === "pdf") {
    renderPDF(item);
}


/* Website */
else if (mode === "web") {
    renderBrowser(item);
}

/* Mobile application */
else if (mode === "mobile") {
    renderPhone(item);
}

/* Digital design */
else {
    renderDigital(item);
}

/* NAVIGATION */
    viewerPrev.hidden =
    currentItems.length <= 1;
    viewerNext.hidden =
    currentItems.length <= 1;   
}

/* OPEN VIEWER */

function openViewer(
    items,
    startIndex = 0,
    mode = "digital"
) {
    if (
        !viewer ||
        !items ||
        !items.length
    ) {
        return;
    }

    currentItems =
        items;

    currentIndex =
        Math.max(
            0,
            Math.min(
                startIndex,
                items.length - 1
            )
        );

    currentMode =
        mode;

/* Mark certificate viewers for extra protection */
    viewer.classList.toggle(
        "certificate-view",
        mode === "certificate"
    );
    renderCurrent();
    viewer.classList.add(
        "is-open"
    );
    viewer.setAttribute(
        "aria-hidden",
        "false"
    );
    document.body.classList.add(
        "viewer-open"
    );
}

/* CLOSE VIEWER */

function closeViewer() {
    if (!viewer) {
        return;
    }
    viewer.classList.remove(
        "is-open"
    );
    viewer.classList.remove(
    "certificate-view"
    );
    viewer.setAttribute(
        "aria-hidden",
        "true"
    );
    viewerContent.replaceChildren();
    document.body.classList.remove(
        "viewer-open"
    );
}

/* PREVIOUS / NEXT */
function stepViewer(direction) {
    if (!currentItems.length) {
        return;
    }
    currentIndex +=
        direction;
    if (
        currentIndex < 0
    ) {
        currentIndex =
            currentItems.length - 1;
    }
    if (
        currentIndex >=
        currentItems.length
    ) {

        currentIndex = 0;
    }
    renderCurrent();
}

/* PROJECT BUTTONS */

document
    .querySelectorAll("[data-project]")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const project =
                    button.dataset.project;
                const files =
                    PROJECT_FILES[project];
                if (!files) {
                    console.warn(
                        "Project files not found:",
                        project
                    );
                    return;
                }
                openViewer(
                    files,
                    0
                );
            }
        );
    });

document.querySelectorAll(".grad-photo").forEach(photo => {
    photo.addEventListener("click", () => {
        openViewer(
            [
                {
                    src: "Me/gradpic.jpg",
                    title: "Graduation Photo",
                    type: "image",
                    mode: "image"
                }
            ],
            0,
            "image"
        );
    });
});

/* CERTIFICATE BUTTONS */
document
    .querySelectorAll("button[data-view][data-src]")
    .forEach(button => {
        button.addEventListener("click", () => {
            const source =
                button.dataset.src;
            const title =
                button.dataset.title ||
                "Certificate Preview";
            const type =
                detectType(source);
            openViewer(
                [
                    {
                        src: source,
                        title: title,
                        type: type,
                        mode: "certificate"
                    }
                ],
                0,
                "certificate"
            );
        });
    });

/*  DESIGN ALBUM BUTTONS */
document
    .querySelectorAll("[data-album]")
    .forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const key =
                    button.dataset.album;
                const album =
                    DESIGN_ALBUMS[key];
                if (!album) {
                    return;
                }
                albumTitle.textContent =
                    album.title;
                albumGrid.innerHTML =
                    "";
                album.files.forEach(
                    (item, index) => {
                        const card =
                            document.createElement(
                                "button"
                            );
                        card.type =
                            "button";
                        card.className =
                            "album-item";
                        card.innerHTML = `
                            <div class="album-thumb">
                            </div>
                            <span class="album-label">
                                ${item.title}
                            </span>
                        `;
                        const thumb =
                            card.querySelector(
                                ".album-thumb"
                            );
                        thumb.appendChild(
                            createImage(
                                item.src,
                                item.title
                            )
                        );
                        card.addEventListener(
                            "click",
                            () => {
                                closeAlbum();
                                openViewer(
                                    album.files,
                                    index,
                                    album.mode
                                );
                            }
                        );
                        albumGrid.appendChild(
                            card
                        );
                    }
                );
                albumModal.classList.add(
                    "is-open"
                );
                albumModal.setAttribute(
                    "aria-hidden",
                    "false"
                );
                document.body.classList.add(
                    "viewer-open"
                );
            }
        );
    });

/* CLOSE ALBUM */

function closeAlbum() {
    if (!albumModal) {
        return;
    }
    albumModal.classList.remove(
        "is-open"
    );
    albumModal.setAttribute(
        "aria-hidden",
        "true"
    );
    document.body.classList.remove(
        "viewer-open"
    );
}

/* BUTTON EVENTS */

viewerClose?.addEventListener(
    "click",
    closeViewer
);

viewerPrev?.addEventListener(
    "click",
    () => stepViewer(-1)
);

viewerNext?.addEventListener(
    "click",
    () => stepViewer(1)
);

albumClose?.addEventListener(
    "click",
    closeAlbum
);


/* ESCAPE KEY */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape"
        ) {
            if (
                viewer?.classList.contains(
                    "is-open"
                )
            ) {
                closeViewer();

            }
            if (
                albumModal?.classList.contains(
                    "is-open"
                )
            ) {
                closeAlbum();
            }
        }

        if (
            viewer?.classList.contains(
                "is-open"
            )
        ) {
            if (
                event.key === "ArrowLeft"
            ) {
                stepViewer(-1);
            }

            if (
                event.key === "ArrowRight"
            ) {
                stepViewer(1);
            }
        }
    }
);

/* CLICK DARK BACKGROUND TO CLOSE */

viewer?.addEventListener(
    "click",
    event => {
        if (
            event.target === viewer
        ) {
          closeViewer();
        }
    }
);

albumModal?.addEventListener(
    "click",
    event => {
        if (
            event.target === albumModal
        ) {
            closeAlbum();
        }
    }
);


/* PRIVACY DETERRENTS */
const protectedSelector = `
    .viewer img,
    .viewer video,
    .album-modal img,
    .project-visual img,
    .experience-media img
`;

/* Disable right-click */
document.addEventListener(
    "contextmenu",
    event => {
        if (
            event.target.closest(
                protectedSelector
            )
        ) {
            event.preventDefault();
        }
    }
);


/* Disable dragging */
document.addEventListener(
    "dragstart",
    event => {
        if (
            event.target.closest(
                protectedSelector
            )
        ) {
            event.preventDefault();
        }
    }
);


/* Disable common save/source/print shortcuts
   while a viewer is open */
document.addEventListener(
    "keydown",
    event => {
        const open =
            viewer?.classList.contains(
                "is-open"
            ) ||
            albumModal?.classList.contains(
                "is-open"
            );
        if (!open) {
            return;
        }
        if (
            (event.ctrlKey ||
             event.metaKey) &&
            ["s", "u", "p"].includes(
                event.key.toLowerCase()
            )
        ) {
            event.preventDefault();
        }
    }
);

/* HIDE VIEWER WHEN WINDOW LOSES FOCUS */
window.addEventListener(
    "blur",
    () => {
        viewer?.classList.add(
            "is-hidden"
        );
    }
);

window.addEventListener(
    "focus",
    () => {
        viewer?.classList.remove(
            "is-hidden"
        );
    }
);

/* TOUCH SWIPE */
let touchStartX = 0;
viewer?.addEventListener(
    "touchstart",
    event => {
        touchStartX =
            event.changedTouches[0]
                .screenX;
    },
    {
        passive: true
    }
);

viewer?.addEventListener(
    "touchend",
    event => {
        const touchEndX =
            event.changedTouches[0]
                .screenX;
        const difference =
            touchStartX - touchEndX;
        if (
            Math.abs(difference) < 50
        ) {
            return;
        }
        if (difference > 0) {
            stepViewer(1);
        } else {
            stepViewer(-1);
        }
    },
    {
        passive: true
    }
);
});