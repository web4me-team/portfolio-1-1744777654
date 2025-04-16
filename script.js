// 处理publication链接
function handlePublicationLinks() {
    // 尝试从URL参数获取resumeData
    const urlParams = new URLSearchParams(window.location.search);
    const resumeDataParam = urlParams.get('resumeData');
    
    if (resumeDataParam) {
        try {
            const resumeData = JSON.parse(decodeURIComponent(resumeDataParam));
            
            // 如果存在publications数据并且有内容
            if (resumeData.publications && resumeData.publications.length) {
                const publicationsContainer = document.getElementById('publications-container');
                if (!publicationsContainer) return;
                
                // 清除现有内容
                publicationsContainer.innerHTML = '';
                
                // 为每个publication创建HTML元素
                resumeData.publications.forEach(pub => {
                    const pubElement = document.createElement('div');
                    pubElement.className = 'publication-item';
                    
                    let authorText = '';
                    if (pub.authors && pub.authors.length) {
                        authorText = pub.authors.join(', ');
                    }
                    
                    pubElement.innerHTML = `
                        <h3 class="publication-title">${pub.title || 'Untitled Publication'}</h3>
                        <div class="publication-meta">
                            <span class="journal">${pub.journal || ''}</span>
                            <span class="year">${pub.year || ''}</span>
                        </div>
                        <p class="authors">${authorText}</p>
                        ${pub.links ? `
                        <div class="publication-links">
                            <a href="${ensureHttpPrefix(pub.links)}" target="_blank">
                                <i class="fas fa-external-link-alt"></i> View Paper
                            </a>
                        </div>` : ''}
                    `;
                    
                    publicationsContainer.appendChild(pubElement);
                });
            }
        } catch (error) {
            console.error('Error parsing resume data:', error);
        }
    }
}

// 处理其他部分的数据...
function handleResumeData() {
    // 可以在这里添加处理其他section的代码
}

// Healthcare Template JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add specific animations for research interests
    animateResearchInterests();
    
    // Set up mobile menu
    setupMobileMenu();
    
    // Handle smooth scrolling
    setupSmoothScrolling();
    
    handlePublicationLinks();
    handleResumeData();

    // Call fixExternalLinks to fix existing links
    fixExternalLinks();
});

// Initialize animations for various elements
function initAnimations() {
    // Animate elements when they come into view
    const elementsToAnimate = [
        '.timeline-item', 
        '.experience-card', 
        '.project-card', 
        '.publication-item', 
        '.skill-item', 
        '.teaching-card', 
        '.award-card',
        '.contact-card'
    ];
    
    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    });
    
    // Set up intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    
    // Add animation to skill bars
    animateSkillBars();
}

// Animate skill bars on scroll
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get the width value from the style attribute
                const targetWidth = entry.target.style.width;
                // First set width to 0
                entry.target.style.width = '0%';
                // Then animate to target width
                setTimeout(() => {
                    entry.target.style.transition = 'width 1.5s ease-in-out';
                    entry.target.style.width = targetWidth;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Animate research interests
function animateResearchInterests() {
    const researchInterests = document.querySelectorAll('.research-interest');
    
    // Initial state
    researchInterests.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
    });
    
    // Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    researchInterests.forEach(item => {
        observer.observe(item);
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
}

// Adding animation CSS
const styleElement = document.createElement('style');
styleElement.textContent = `
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleElement);

// Add a function to ensure URLs have proper protocol prefix
function ensureHttpPrefix(url) {
    if (!url) return '';
    return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

// Function to fix all external links on the page
function fixExternalLinks() {
    // Find all links with href attribute
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip internal links, mailto: and tel: links
        if (href.startsWith('#') || href.startsWith('/') || 
            href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // Skip links that already have protocols
        if (href.match(/^https?:\/\//)) {
            return;
        }
        
        // Add https:// prefix to external links
        link.setAttribute('href', `https://${href}`);
    });
}

// Update publication links with proper URL format
const updatePublicationLinks = function(publication, pubData) {
    if (pubData.links) {
        const formattedLink = ensureHttpPrefix(pubData.links);
        publication.querySelector('.publication-link').href = formattedLink;
    }
};

// Update any other dynamic links that might be generated
// ... 