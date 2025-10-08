// Commands Data
const commands = [
    { command: "/ban", description: "Ban a member from the server.", category: "Moderation" },
    { command: "/unban", description: "Unban a previously banned member.", category: "Moderation" },
    { command: "/warn", description: "Issue a warning to a member.", category: "Moderation" },
    { command: "/removewarn", description: "Remove an existing warning.", category: "Moderation" },
    { command: "/modcard", description: "View a user's moderation history.", category: "Moderation" },
    { command: "/mute", description: "Mutes a user so they cannot send messages.", category: "Moderation" },
    { command: "/lock", description: "Locks a channel so no messages can be sent.", category: "Channel Management" },
    { command: "/unlock", description: "Unlocks a channel so messages can be sent.", category: "Channel Management" },
    { command: "/config", description: "Configure server settings.", category: "Configuration" },
    { command: "/version", description: "View the bot's current version.", category: "Configuration" }
];

// Category Configuration
const categories = {
    "Moderation": {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
        badgeClass: 'badge-moderation'
    },
    "Channel Management": {
        icon: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
        badgeClass: 'badge-channel'
    },
    "Configuration": {
        icon: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle>',
        badgeClass: 'badge-config'
    }
};

// State
let currentSearch = '';

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
});

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
}

// View Commands Button
const viewCommandsBtn = document.getElementById('viewCommandsBtn');
viewCommandsBtn.addEventListener('click', () => {
    const searchSection = document.getElementById('searchSection');
    const headerHeight = 64;
    const elementPosition = searchSection.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
});

// Search Functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderCommands();
});

// Keyboard Shortcut (Ctrl+K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Copy to Clipboard
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
        }, 2000);
    });
}

// Render Commands
function renderCommands() {
    const container = document.getElementById('commandsContainer');
    const noResults = document.getElementById('noResults');
    const searchTerm = document.getElementById('searchTerm');
    
    // Filter commands
    const filteredCommands = commands.filter(cmd => 
        cmd.command.toLowerCase().includes(currentSearch) ||
        cmd.description.toLowerCase().includes(currentSearch)
    );
    
    if (filteredCommands.length === 0) {
        container.innerHTML = '';
        searchTerm.textContent = currentSearch;
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    // Group by category
    const grouped = {};
    filteredCommands.forEach(cmd => {
        if (!grouped[cmd.category]) {
            grouped[cmd.category] = [];
        }
        grouped[cmd.category].push(cmd);
    });
    
    // Render categories
    let html = '';
    
    Object.keys(grouped).forEach(category => {
        const config = categories[category];
        html += `
            <div class="category-section">
                <div class="category-header">
                    <div class="category-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            ${config.icon}
                        </svg>
                    </div>
                    <h2 class="category-title">${category === "Moderation" ? "Moderation Commands" : category}</h2>
                </div>
                <div class="commands-grid">
                    ${grouped[category].map(cmd => `
                        <div class="command-card">
                            <div class="command-header">
                                <div class="command-info">
                                    <div class="command-top">
                                        <code class="command-name">${cmd.command}</code>
                                        <span class="command-badge ${config.badgeClass}">${cmd.category}</span>
                                    </div>
                                    <p class="command-description">${cmd.description}</p>
                                </div>
                                <button class="copy-btn" onclick="copyToClipboard('${cmd.command}', this)" aria-label="Copy command">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Initial Render
renderCommands();
