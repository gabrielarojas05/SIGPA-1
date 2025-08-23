// ===== NAVIGATION MODULE =====

export class Navigation {
    constructor(config) {
        this.sidebar = config.sidebar;
        this.sidebarToggle = config.sidebarToggle;
        this.mainContent = config.mainContent;

        this.isCollapsed = false;
        this.isMobile = false;
        this.isMobileOpen = false;

        // Bind methods
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleNavLinkClick = this.handleNavLinkClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.init();
    }

    init() {
        try {
            // Check initial screen size
            this.checkScreenSize();

            // Setup event listeners
            this.setupEventListeners();

            // Initialize sidebar state
            this.initializeSidebarState();

            console.log('✅ Navigation module initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Navigation module:', error);
        }
    }

    setupEventListeners() {
        try {
            // Sidebar toggle button
            if (this.sidebarToggle) {
                this.sidebarToggle.addEventListener('click', this.handleToggleClick);
            }

            // Navigation links
            const navLinks = this.sidebar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', this.handleNavLinkClick);
            });

            // Outside click for mobile
            document.addEventListener('click', this.handleOutsideClick);

            // Keyboard navigation
            document.addEventListener('keydown', this.handleKeyDown);

            // Window resize
            window.addEventListener('resize', () => this.checkScreenSize());

            console.log('✅ Navigation event listeners setup successfully');

        } catch (error) {
            console.error('❌ Failed to setup navigation event listeners:', error);
        }
    }

    initializeSidebarState() {
        try {
            // Check localStorage for saved state
            const savedState = localStorage.getItem('sigpa-sidebar-collapsed');
            if (savedState !== null) {
                this.isCollapsed = JSON.parse(savedState);
                this.applySidebarState();
            }

            // Check if we should start collapsed on mobile
            if (this.isMobile) {
                this.collapseSidebar();
            }

        } catch (error) {
            console.error('❌ Failed to initialize sidebar state:', error);
        }
    }

    checkScreenSize() {
        try {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;

            // Handle transition from desktop to mobile
            if (!wasMobile && this.isMobile) {
                this.handleMobileTransition();
            }

            // Handle transition from mobile to desktop
            if (wasMobile && !this.isMobile) {
                this.handleDesktopTransition();
            }

        } catch (error) {
            console.error('❌ Error checking screen size:', error);
        }
    }

    handleMobileTransition() {
        try {
            // Collapse sidebar on mobile
            this.collapseSidebar();

            // Add mobile-specific classes
            this.sidebar.classList.add('mobile');

            // Ensure sidebar is hidden on mobile
            this.hideSidebar();

        } catch (error) {
            console.error('❌ Error handling mobile transition:', error);
        }
    }

    handleDesktopTransition() {
        try {
            // Remove mobile-specific classes
            this.sidebar.classList.remove('mobile');

            // Show sidebar on desktop
            this.showSidebar();

            // Restore previous collapsed state
            this.applySidebarState();

        } catch (error) {
            console.error('❌ Error handling desktop transition:', error);
        }
    }

    handleToggleClick(event) {
        try {
            event.preventDefault();
            event.stopPropagation();

            if (this.isMobile) {
                this.toggleMobileSidebar();
            } else {
                this.toggleSidebar();
            }

        } catch (error) {
            console.error('❌ Error handling toggle click:', error);
        }
    }

    handleNavLinkClick(event) {
        try {
            const link = event.currentTarget;
            const section = link.getAttribute('data-section');

            // Update active state
            this.updateActiveNavItem(link);

            // Handle navigation (placeholder for future implementation)
            this.navigateToSection(section);

            // Close mobile sidebar if open
            if (this.isMobile && this.isMobileOpen) {
                this.hideSidebar();
            }

        } catch (error) {
            console.error('❌ Error handling nav link click:', error);
        }
    }

    handleOutsideClick(event) {
        try {
            // Only handle mobile outside clicks
            if (!this.isMobile) return;

            // Check if click is outside sidebar
            if (this.sidebar && !this.sidebar.contains(event.target) &&
                this.sidebarToggle && !this.sidebarToggle.contains(event.target)) {

                if (this.isMobileOpen) {
                    this.hideSidebar();
                }
            }

        } catch (error) {
            console.error('❌ Error handling outside click:', error);
        }
    }

    handleKeyDown(event) {
        try {
            // ESC key to close mobile sidebar
            if (event.key === 'Escape' && this.isMobile && this.isMobileOpen) {
                this.hideSidebar();
                return;
            }

            // Tab navigation within sidebar
            if (event.key === 'Tab' && this.sidebar.contains(event.target)) {
                this.handleTabNavigation(event);
            }

        } catch (error) {
            console.error('❌ Error handling key down:', error);
        }
    }

    handleTabNavigation(event) {
        try {
            const navLinks = Array.from(this.sidebar.querySelectorAll('.nav-link'));
            const currentIndex = navLinks.indexOf(event.target);

            if (event.shiftKey && event.key === 'Tab') {
                // Shift + Tab: go to previous
                if (currentIndex === 0) {
                    event.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                }
            } else if (event.key === 'Tab') {
                // Tab: go to next
                if (currentIndex === navLinks.length - 1) {
                    event.preventDefault();
                    navLinks[0].focus();
                }
            }

        } catch (error) {
            console.error('❌ Error handling tab navigation:', error);
        }
    }

    toggleSidebar() {
        try {
            if (this.isCollapsed) {
                this.expandSidebar();
            } else {
                this.collapseSidebar();
            }
        } catch (error) {
            console.error('❌ Error toggling sidebar:', error);
        }
    }

    collapseSidebar() {
        try {
            this.isCollapsed = true;
            this.applySidebarState();
            this.saveSidebarState();

            console.log('📱 Sidebar collapsed');

        } catch (error) {
            console.error('❌ Error collapsing sidebar:', error);
        }
    }

    expandSidebar() {
        try {
            this.isCollapsed = false;
            this.applySidebarState();
            this.saveSidebarState();

            console.log('📱 Sidebar expanded');

        } catch (error) {
            console.error('❌ Error expanding sidebar:', error);
        }
    }

    toggleMobileSidebar() {
        try {
            if (this.isMobileOpen) {
                this.hideSidebar();
            } else {
                this.showSidebar();
            }
        } catch (error) {
            console.error('❌ Error toggling mobile sidebar:', error);
        }
    }

    showSidebar() {
        try {
            if (this.isMobile) {
                this.isMobileOpen = true;
                this.sidebar.classList.add('mobile-open');
                document.body.classList.add('sidebar-open');

                // Focus first nav item
                const firstNavLink = this.sidebar.querySelector('.nav-link');
                if (firstNavLink) {
                    firstNavLink.focus();
                }

                console.log('📱 Mobile sidebar shown');
            }
        } catch (error) {
            console.error('❌ Error showing sidebar:', error);
        }
    }

    hideSidebar() {
        try {
            if (this.isMobile) {
                this.isMobileOpen = false;
                this.sidebar.classList.remove('mobile-open');
                document.body.classList.remove('sidebar-open');

                console.log('📱 Mobile sidebar hidden');
            }
        } catch (error) {
            console.error('❌ Error hiding sidebar:', error);
        }
    }

    applySidebarState() {
        try {
            if (this.isCollapsed) {
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('sidebar-collapsed');
            } else {
                this.sidebar.classList.remove('collapsed');
                this.mainContent.classList.remove('sidebar-collapsed');
            }
        } catch (error) {
            console.error('❌ Error applying sidebar state:', error);
        }
    }

    saveSidebarState() {
        try {
            localStorage.setItem('sigpa-sidebar-collapsed', JSON.stringify(this.isCollapsed));
        } catch (error) {
            console.error('❌ Error saving sidebar state:', error);
        }
    }

    updateActiveNavItem(activeLink) {
        try {
            // Remove active class from all nav items
            const navItems = this.sidebar.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));

            // Add active class to current nav item
            const navItem = activeLink.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }

        } catch (error) {
            console.error('❌ Error updating active nav item:', error);
        }
    }

    navigateToSection(section) {
        try {
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                const sectionNames = {
                    dashboard: 'Dashboard',
                    cultivos: 'Cultivos',
                    clima: 'Clima',
                    riego: 'Riego',
                    calendario: 'Calendario',
                    alertas: 'Alertas'
                };

                pageTitle.textContent = sectionNames[section] || 'Dashboard';
            }

            // Dispatch navigation event
            this.dispatchEvent('navigation:changed', { section });

            console.log(`🧭 Navigated to section: ${section}`);

        } catch (error) {
            console.error('❌ Error navigating to section:', error);
        }
    }

    handleResize() {
        try {
            this.checkScreenSize();
        } catch (error) {
            console.error('❌ Error handling resize:', error);
        }
    }

    dispatchEvent(eventName, detail = {}) {
        try {
            const event = new CustomEvent(eventName, {
                detail,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('❌ Error dispatching event:', error);
        }
    }

    // Public API methods
    getSidebarState() {
        return {
            isCollapsed: this.isCollapsed,
            isMobile: this.isMobile,
            isMobileOpen: this.isMobileOpen
        };
    }

    setActiveSection(section) {
        try {
            const navLink = this.sidebar.querySelector(`[data-section="${section}"]`);
            if (navLink) {
                this.updateActiveNavItem(navLink);
                this.navigateToSection(section);
            }
        } catch (error) {
            console.error('❌ Error setting active section:', error);
        }
    }

    // Cleanup method
    cleanup() {
        try {
            // Remove event listeners
            if (this.sidebarToggle) {
                this.sidebarToggle.removeEventListener('click', this.handleToggleClick);
            }

            const navLinks = this.sidebar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.removeEventListener('click', this.handleNavLinkClick);
            });

            document.removeEventListener('click', this.handleOutsideClick);
            document.removeEventListener('keydown', this.handleKeyDown);

            console.log('✅ Navigation module cleanup completed');

        } catch (error) {
            console.error('❌ Error during navigation cleanup:', error);
        }
    }
}
