// Default links and groups
const defaultGroups = ['Main', 'Work', 'Personal'];
const defaultLinks = [
    { name: 'Google', url: 'https://google.com', icon: '🔍', group: 'Main' }
];

// Load settings, groups, and links
let links = [];
let groups = [];
let activeGroup = 'Main';
let notes = '';
let pomodoro = {
    duration: 25 * 60, // 25 minutes in seconds
    timeLeft: 25 * 60,
    isRunning: false,
    mode: 'pomodoro', // pomodoro, break, long
    interval: null
};
let settings = { 
    gradient: 'dark-gray',
    backgroundType: 'gradient',
    backgroundColor: '#161D26',
    backgroundUrl: '',
    backgroundData: '',
    shadowIntensity: 'medium',
    searchVisible: true,
    timezonesVisible: true,
    timeVisible: true,
    linksVisible: true,
    pomodoroVisible: true,
    notesVisible: false,
    timeAlign: 'center',
    timezonesAlign: 'center',
    linksAlign: 'center',
    pomodoroAlign: 'center',
    notesAlign: 'center',
    linkSize: 'compact',
    timeFormat: '24h',
    showSeconds: true
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    await loadGroups();
    await loadLinks();
    await loadNotes();
    applyLayout();
    applyBackground();
    applyShadows();
    applySearchVisibility();
    renderGroups();
    renderLinks();
    updateTime();
    setInterval(updateTime, 1000);
    
    // Event listeners
    document.getElementById('add-link-btn').addEventListener('click', openAddLinkModal);
    document.getElementById('add-group-btn').addEventListener('click', openAddGroupModal);
    document.getElementById('settings-btn').addEventListener('click', openSettingsModal);
    document.getElementById('save-link').addEventListener('click', saveLink);
    document.getElementById('cancel-link').addEventListener('click', closeAddLinkModal);
    document.getElementById('save-group').addEventListener('click', saveGroup);
    document.getElementById('cancel-group').addEventListener('click', closeAddGroupModal);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('cancel-settings').addEventListener('click', closeSettingsModal);
    
    // Notes auto-save
    document.getElementById('notes-text').addEventListener('input', (e) => {
        notes = e.target.value;
        saveNotesToStorage();
    });
    
    // Pomodoro controls
    document.getElementById('pomodoro-start').addEventListener('click', startPomodoro);
    document.getElementById('pomodoro-pause').addEventListener('click', pausePomodoro);
    document.getElementById('pomodoro-reset').addEventListener('click', resetPomodoro);
    
    // Pomodoro mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setPomodoroMode(btn.dataset.mode);
        });
    });
    
    // Settings tabs
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab + '-tab').classList.add('active');
        });
    });
    
    // Emoji picker
    document.getElementById('emoji-picker-btn').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('emoji-picker').classList.toggle('active');
    });
    
    document.querySelectorAll('.emoji-option').forEach(emoji => {
        emoji.addEventListener('click', () => {
            document.getElementById('link-icon').value = emoji.textContent;
            document.getElementById('emoji-picker').classList.remove('active');
        });
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', (e) => {
        const picker = document.getElementById('emoji-picker');
        const btn = document.getElementById('emoji-picker-btn');
        if (!picker.contains(e.target) && e.target !== btn) {
            picker.classList.remove('active');
        }
    });
    
    // Search bar functionality
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value.trim();
            if (query) {
                // Open Google search in new tab
                window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                e.target.value = '';
            }
        }
    });
    
    // Background type selector
    document.getElementById('background-type').addEventListener('change', (e) => {
        const gradientSettings = document.getElementById('gradient-settings');
        const colorSettings = document.getElementById('color-settings');
        const urlSettings = document.getElementById('url-settings');
        const localSettings = document.getElementById('local-settings');
        
        // Hide all
        gradientSettings.style.display = 'none';
        colorSettings.style.display = 'none';
        urlSettings.style.display = 'none';
        localSettings.style.display = 'none';
        
        // Show selected
        switch(e.target.value) {
            case 'gradient':
                gradientSettings.style.display = 'block';
                break;
            case 'color':
                colorSettings.style.display = 'block';
                break;
            case 'url':
                urlSettings.style.display = 'block';
                break;
            case 'local':
                localSettings.style.display = 'block';
                break;
        }
    });
    
    // Local file upload handler
    document.getElementById('background-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                settings.backgroundData = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

// Time and date update
function updateTime() {
    const now = new Date();
    
    // Determine time format options
    const use24Hour = settings.timeFormat !== '12h';
    const showSeconds = settings.showSeconds !== false;
    
    // Main time (local)
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !use24Hour
    };
    
    if (showSeconds) {
        timeOptions.second = '2-digit';
    }
    
    const timeStr = now.toLocaleTimeString('en-GB', timeOptions);
    document.getElementById('time').textContent = timeStr;
    
    // Date
    const dateStr = now.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long'
    });
    document.getElementById('date').textContent = dateStr;
    
    // Time zones - always use selected format
    const tzOptions = {
        hour: '2-digit', 
        minute: '2-digit',
        hour12: !use24Hour
    };
    
    document.getElementById('london-time').textContent = 
        now.toLocaleTimeString('en-GB', { 
            ...tzOptions,
            timeZone: 'Europe/London'
        });
    
    document.getElementById('la-time').textContent = 
        now.toLocaleTimeString('en-GB', { 
            ...tzOptions,
            timeZone: 'America/Los_Angeles'
        });
    
    document.getElementById('tokyo-time').textContent = 
        now.toLocaleTimeString('en-GB', { 
            ...tzOptions,
            timeZone: 'Asia/Tokyo'
        });
    
    document.getElementById('sydney-time').textContent = 
        now.toLocaleTimeString('en-GB', { 
            ...tzOptions,
            timeZone: 'Australia/Sydney'
        });
    
    // Greeting
    const hour = now.getHours();
    let greetingText = 'Good ';
    if (hour < 12) greetingText += 'morning';
    else if (hour < 18) greetingText += 'afternoon';
    else greetingText += 'evening';
    document.getElementById('greeting').textContent = greetingText;
}

// Storage functions
async function loadSettings() {
    return new Promise((resolve) => {
        browser.storage.local.get(['settings'], (result) => {
            if (result.settings) {
                settings = result.settings;
                // Ensure layout object exists with defaults
                if (!settings.layout) {
                    settings.layout = {
                        timePosition: 'top',
                        timezonesPosition: 'below-time',
                        greetingPosition: 'center',
                        linksLayout: 'center',
                        linkSize: 'medium',
                        notesVisible: false,
                        notesPosition: 'bottom-left',
                        pomodoroVisible: false,
                        pomodoroPosition: 'center'
                    };
                }
                // Ensure pomodoro settings exist for old saves
                if (settings.layout.pomodoroVisible === undefined) {
                    settings.layout.pomodoroVisible = false;
                    settings.layout.pomodoroPosition = 'center';
                }
                // Ensure links position exists for old saves
                if (settings.layout.linksPosition === undefined) {
                    settings.layout.linksPosition = 'below-greeting';
                }
                document.body.className = `gradient-${settings.gradient}`;
            }
            resolve();
        });
    });
}

async function loadGroups() {
    return new Promise((resolve) => {
        browser.storage.local.get(['groups', 'activeGroup'], (result) => {
            groups = result.groups || defaultGroups;
            activeGroup = result.activeGroup || groups[0];
            resolve();
        });
    });
}

async function loadLinks() {
    return new Promise((resolve) => {
        browser.storage.local.get(['links'], (result) => {
            links = result.links || defaultLinks;
            resolve();
        });
    });
}

async function loadNotes() {
    return new Promise((resolve) => {
        browser.storage.local.get(['notes'], (result) => {
            notes = result.notes || '';
            document.getElementById('notes-text').value = notes;
            resolve();
        });
    });
}

function saveGroupsToStorage() {
    browser.storage.local.set({ groups, activeGroup });
}

function saveLinksToStorage() {
    browser.storage.local.set({ links });
}

function saveNotesToStorage() {
    browser.storage.local.set({ notes });
}

function saveSettingsToStorage() {
    browser.storage.local.set({ settings });
}

// Render groups tabs
function renderGroups() {
    const container = document.getElementById('link-groups-tabs');
    container.innerHTML = '';
    
    groups.forEach((group) => {
        const tab = document.createElement('div');
        tab.className = `group-tab ${group === activeGroup ? 'active' : ''}`;
        tab.textContent = group;
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-group';
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editGroup(group);
        });
        tab.appendChild(editBtn);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-group';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteGroup(group);
        });
        tab.appendChild(deleteBtn);
        
        // Click to switch group
        tab.addEventListener('click', () => {
            activeGroup = group;
            saveGroupsToStorage();
            renderGroups();
            renderLinks();
        });
        
        container.appendChild(tab);
    });
    
    // Update group dropdown in add link modal
    updateGroupDropdown();
    
    // Reapply shadows to active tabs
    applyShadows();
}

// Render links for active group
function renderLinks() {
    const container = document.getElementById('quick-links');
    container.innerHTML = '';
    
    const groupLinks = links.filter(link => link.group === activeGroup);
    
    groupLinks.forEach((link, index) => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.className = 'link-item size-' + (settings.linkSize || 'compact');
        linkEl.target = '_blank';
        linkEl.rel = 'noopener noreferrer';
        linkEl.draggable = true;
        
        const actualIndex = links.indexOf(link);
        linkEl.dataset.index = actualIndex;
        
        // Check if icon is a URL (starts with http) or emoji/text
        const isIconUrl = link.icon && (link.icon.startsWith('http://') || link.icon.startsWith('https://'));
        
        if (isIconUrl) {
            // For URL icons, only try direct fetch (no external services)
            const iconImg = document.createElement('img');
            iconImg.src = link.icon;
            iconImg.alt = '';
            iconImg.className = 'link-icon-img';
            
            const fallbackIcon = document.createElement('span');
            fallbackIcon.className = 'link-icon';
            fallbackIcon.style.display = 'none';
            fallbackIcon.textContent = '🔗';
            
            // Simple error handler - just show emoji fallback
            iconImg.addEventListener('error', function handleError() {
                this.style.display = 'none';
                fallbackIcon.style.display = 'inline';
            });
            
            const linkText = document.createElement('span');
            linkText.className = 'link-text';
            linkText.textContent = link.name;
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-link';
            editBtn.dataset.index = actualIndex;
            editBtn.title = 'Edit link';
            editBtn.textContent = '✏️';
            
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'refresh-link';
            refreshBtn.dataset.index = actualIndex;
            refreshBtn.title = 'Refresh icon';
            refreshBtn.textContent = '↻';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-link';
            deleteBtn.dataset.index = actualIndex;
            deleteBtn.textContent = '×';
            
            linkEl.appendChild(iconImg);
            linkEl.appendChild(fallbackIcon);
            linkEl.appendChild(linkText);
            linkEl.appendChild(editBtn);
            linkEl.appendChild(refreshBtn);
            linkEl.appendChild(deleteBtn);
        } else {
            // For emoji/text icons
            linkEl.innerHTML = `
                <span class="link-icon">${link.icon || '🔗'}</span>
                <span class="link-text">${link.name}</span>
                <button class="edit-link" data-index="${actualIndex}" title="Edit link">✏️</button>
                <button class="refresh-link" data-index="${actualIndex}" title="Refresh icon">↻</button>
                <button class="delete-link" data-index="${actualIndex}">×</button>
            `;
        }
        
        // Edit button
        linkEl.querySelector('.edit-link').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editLink(actualIndex);
        });
        
        // Refresh button
        linkEl.querySelector('.refresh-link').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            refreshLinkIcon(actualIndex);
        });
        
        // Delete button
        linkEl.querySelector('.delete-link').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteLink(actualIndex);
        });
        
        // Drag and drop events
        linkEl.addEventListener('dragstart', handleDragStart);
        linkEl.addEventListener('dragover', handleDragOver);
        linkEl.addEventListener('drop', handleDrop);
        linkEl.addEventListener('dragend', handleDragEnd);
        
        container.appendChild(linkEl);
    });
    
    // Reapply shadows to links
    applyShadows();
}

// Drag and drop handlers
let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // Swap positions in array
        const draggedLink = links[draggedIndex];
        const targetLink = links[targetIndex];
        
        links[draggedIndex] = targetLink;
        links[targetIndex] = draggedLink;
        
        saveLinksToStorage();
        renderLinks();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

function updateGroupDropdown() {
    const select = document.getElementById('link-group');
    select.innerHTML = '';
    
    groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = group;
        if (group === activeGroup) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

// Modal functions
function openAddLinkModal() {
    document.getElementById('add-link-modal').classList.add('active');
    document.getElementById('link-name').value = '';
    document.getElementById('link-url').value = '';
    document.getElementById('link-icon').value = '';
    document.getElementById('link-name').focus();
}

function closeAddLinkModal() {
    document.getElementById('add-link-modal').classList.remove('active');
}

function openAddGroupModal() {
    document.getElementById('add-group-modal').classList.add('active');
    document.getElementById('group-name').value = '';
    document.getElementById('group-name').focus();
}

function closeAddGroupModal() {
    document.getElementById('add-group-modal').classList.remove('active');
}

function openSettingsModal() {
    document.getElementById('settings-modal').classList.add('active');
    
    // Load background settings
    document.getElementById('background-type').value = settings.backgroundType || 'gradient';
    document.getElementById('gradient-select').value = settings.gradient;
    document.getElementById('background-color').value = settings.backgroundColor || '#161D26';
    document.getElementById('background-url').value = settings.backgroundUrl || '';
    document.getElementById('shadow-intensity').value = settings.shadowIntensity || 'medium';
    
    // Show/hide appropriate background settings
    const gradientSettings = document.getElementById('gradient-settings');
    const colorSettings = document.getElementById('color-settings');
    const urlSettings = document.getElementById('url-settings');
    const localSettings = document.getElementById('local-settings');
    
    gradientSettings.style.display = 'none';
    colorSettings.style.display = 'none';
    urlSettings.style.display = 'none';
    localSettings.style.display = 'none';
    
    switch(settings.backgroundType) {
        case 'gradient':
            gradientSettings.style.display = 'block';
            break;
        case 'color':
            colorSettings.style.display = 'block';
            break;
        case 'url':
            urlSettings.style.display = 'block';
            break;
        case 'local':
            localSettings.style.display = 'block';
            break;
    }
    
    // Load layout settings
    document.getElementById('time-visibility').value = settings.timeVisible ? 'show' : 'hide';
    document.getElementById('time-align').value = settings.timeAlign || 'center';
    document.getElementById('time-format').value = settings.timeFormat || '24h';
    document.getElementById('show-seconds').value = settings.showSeconds !== false ? 'yes' : 'no';
    document.getElementById('search-visibility').value = settings.searchVisible ? 'show' : 'hide';
    document.getElementById('timezones-visibility').value = settings.timezonesVisible ? 'show' : 'hide';
    document.getElementById('timezones-align').value = settings.timezonesAlign || 'center';
    document.getElementById('links-visibility').value = settings.linksVisible ? 'show' : 'hide';
    document.getElementById('links-align').value = settings.linksAlign || 'center';
    document.getElementById('link-size').value = settings.linkSize || 'compact';
    document.getElementById('pomodoro-visibility').value = settings.pomodoroVisible ? 'show' : 'hide';
    document.getElementById('pomodoro-align').value = settings.pomodoroAlign || 'center';
    document.getElementById('notes-visibility').value = settings.notesVisible ? 'show' : 'hide';
    document.getElementById('notes-align').value = settings.notesAlign || 'center';
    
    // Load links position
    if (settings.layout && settings.layout.linksPosition) {
        document.getElementById('links-position').value = settings.layout.linksPosition;
    } else {
        document.getElementById('links-position').value = 'below-greeting';
    }
}

function closeSettingsModal() {
    document.getElementById('settings-modal').classList.remove('active');
}

// Get favicon URL from a website
function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        // Try standard favicon locations
        return `${urlObj.origin}/favicon.ico`;
    } catch (e) {
        return null;
    }
}

function saveLink() {
    const name = document.getElementById('link-name').value.trim();
    const url = document.getElementById('link-url').value.trim();
    let icon = document.getElementById('link-icon').value.trim();
    const group = document.getElementById('link-group').value;
    
    if (!name || !url) {
        alert('Please fill in both name and URL');
        return;
    }
    
    // Add https:// if missing
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    
    // If no icon provided, try to fetch favicon
    if (!icon) {
        const faviconUrl = getFaviconUrl(finalUrl);
        icon = faviconUrl || '🔗'; // Fallback to link emoji
    }
    
    links.push({ name, url: finalUrl, icon, group });
    saveLinksToStorage();
    renderLinks();
    closeAddLinkModal();
}

function saveGroup() {
    const name = document.getElementById('group-name').value.trim();
    
    if (!name) {
        alert('Please enter a group name');
        return;
    }
    
    if (groups.includes(name)) {
        alert('Group already exists');
        return;
    }
    
    groups.push(name);
    activeGroup = name;
    saveGroupsToStorage();
    renderGroups();
    renderLinks();
    closeAddGroupModal();
}

function deleteLink(index) {
    if (confirm('Delete this link?')) {
        links.splice(index, 1);
        saveLinksToStorage();
        renderLinks();
    }
}

function editLink(index) {
    const link = links[index];
    if (!link) return;
    
    // Populate modal with existing values
    document.getElementById('link-name').value = link.name;
    document.getElementById('link-url').value = link.url;
    document.getElementById('link-icon').value = link.icon;
    document.getElementById('link-group').value = link.group;
    
    // Change save button to update mode
    const saveBtn = document.getElementById('save-link');
    saveBtn.textContent = 'Update';
    
    // Remove old event listener and add new one
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
    
    newSaveBtn.addEventListener('click', function updateLink() {
        const name = document.getElementById('link-name').value.trim();
        const url = document.getElementById('link-url').value.trim();
        const icon = document.getElementById('link-icon').value.trim() || '🔗';
        const group = document.getElementById('link-group').value;
        
        if (!name || !url) {
            alert('Please fill in both name and URL');
            return;
        }
        
        const finalUrl = url.startsWith('http') ? url : `https://${url}`;
        
        links[index] = { name, url: finalUrl, icon, group };
        saveLinksToStorage();
        renderLinks();
        closeAddLinkModal();
        
        // Reset save button
        newSaveBtn.textContent = 'Save';
        const resetBtn = newSaveBtn.cloneNode(true);
        newSaveBtn.parentNode.replaceChild(resetBtn, newSaveBtn);
        resetBtn.addEventListener('click', saveLink);
    });
    
    openAddLinkModal();
}

function refreshLinkIcon(index) {
    const link = links[index];
    if (!link) return;
    
    // Re-fetch the favicon
    const faviconUrl = getFaviconUrl(link.url);
    if (faviconUrl) {
        links[index].icon = faviconUrl;
        saveLinksToStorage();
        renderLinks();
    }
}

function deleteGroup(group) {
    if (groups.length === 1) {
        alert('Cannot delete the last group');
        return;
    }
    
    if (confirm(`Delete group "${group}" and all its links?`)) {
        // Remove group
        groups = groups.filter(g => g !== group);
        
        // Remove all links in this group
        links = links.filter(link => link.group !== group);
        
        // Switch to first group if active group was deleted
        if (activeGroup === group) {
            activeGroup = groups[0];
        }
        
        saveGroupsToStorage();
        saveLinksToStorage();
        renderGroups();
        renderLinks();
    }
}

function editGroup(oldName) {
    const newName = prompt('Rename group:', oldName);
    
    if (!newName || newName === oldName) return;
    
    if (groups.includes(newName)) {
        alert('A group with that name already exists');
        return;
    }
    
    // Update group name in groups array
    const index = groups.indexOf(oldName);
    if (index !== -1) {
        groups[index] = newName;
    }
    
    // Update all links with this group
    links.forEach(link => {
        if (link.group === oldName) {
            link.group = newName;
        }
    });
    
    // Update active group if needed
    if (activeGroup === oldName) {
        activeGroup = newName;
    }
    
    saveGroupsToStorage();
    saveLinksToStorage();
    renderGroups();
    renderLinks();
}

function saveSettings() {
    settings.backgroundType = document.getElementById('background-type').value;
    settings.gradient = document.getElementById('gradient-select').value;
    settings.backgroundColor = document.getElementById('background-color').value;
    settings.backgroundUrl = document.getElementById('background-url').value.trim();
    settings.shadowIntensity = document.getElementById('shadow-intensity').value;
    
    settings.timeVisible = document.getElementById('time-visibility').value === 'show';
    settings.timeAlign = document.getElementById('time-align').value;
    settings.timeFormat = document.getElementById('time-format').value;
    settings.showSeconds = document.getElementById('show-seconds').value === 'yes';
    settings.searchVisible = document.getElementById('search-visibility').value === 'show';
    settings.timezonesVisible = document.getElementById('timezones-visibility').value === 'show';
    settings.timezonesAlign = document.getElementById('timezones-align').value;
    settings.linksVisible = document.getElementById('links-visibility').value === 'show';
    settings.linksAlign = document.getElementById('links-align').value;
    settings.linkSize = document.getElementById('link-size').value;
    settings.pomodoroVisible = document.getElementById('pomodoro-visibility').value === 'show';
    settings.pomodoroAlign = document.getElementById('pomodoro-align').value;
    settings.notesVisible = document.getElementById('notes-visibility').value === 'show';
    settings.notesAlign = document.getElementById('notes-align').value;
    
    // Save links position
    if (!settings.layout) {
        settings.layout = {};
    }
    settings.layout.linksPosition = document.getElementById('links-position').value;
    
    applyBackground();
    applyLayout();
    applyShadows();
    saveSettingsToStorage();
    closeSettingsModal();
}

function applyBackground() {
    switch(settings.backgroundType) {
        case 'color':
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = settings.backgroundColor;
            document.body.className = '';
            break;
            
        case 'url':
            if (settings.backgroundUrl) {
                const img = new Image();
                img.onload = () => {
                    document.body.style.backgroundImage = `url('${settings.backgroundUrl}')`;
                    document.body.style.backgroundColor = '#161D26';
                    document.body.className = 'has-background-image';
                };
                img.onerror = () => {
                    console.error('Failed to load background image:', settings.backgroundUrl);
                    alert('Failed to load image URL. Please check the URL is correct.');
                    document.body.style.backgroundImage = '';
                    document.body.className = `gradient-${settings.gradient}`;
                };
                img.src = settings.backgroundUrl;
            }
            break;
            
        case 'local':
            if (settings.backgroundData) {
                document.body.style.backgroundImage = `url('${settings.backgroundData}')`;
                document.body.style.backgroundColor = '#161D26';
                document.body.className = 'has-background-image';
            }
            break;
            
        case 'gradient':
        default:
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.className = `gradient-${settings.gradient}`;
            break;
    }
}

function applyLayout() {
    const timeSection = document.querySelector('.time-section');
    const timezones = document.querySelector('.timezones');
    const searchBar = document.querySelector('.search-bar');
    const notesWidget = document.querySelector('.notes-widget');
    const pomodoroWidget = document.querySelector('.pomodoro-widget');
    const linkGroupsSection = document.querySelector('.link-groups-section');
    const greeting = document.querySelector('.greeting');
    const container = document.querySelector('.container');
    
    // Time visibility and alignment
    if (settings.timeVisible) {
        timeSection.style.display = 'flex';
        timeSection.style.alignItems = settings.timeAlign === 'left' ? 'flex-start' : 
                                       settings.timeAlign === 'right' ? 'flex-end' : 'center';
    } else {
        timeSection.style.display = 'none';
    }
    
    // Search bar visibility
    if (settings.searchVisible) {
        searchBar.classList.remove('hidden');
    } else {
        searchBar.classList.add('hidden');
    }
    
    // Timezones visibility and alignment
    if (settings.timezonesVisible) {
        timezones.style.display = 'flex';
        timezones.style.justifyContent = settings.timezonesAlign === 'left' ? 'flex-start' : 
                                         settings.timezonesAlign === 'right' ? 'flex-end' : 'center';
    } else {
        timezones.style.display = 'none';
    }
    
    // Links visibility and alignment
    if (settings.linksVisible) {
        linkGroupsSection.style.display = 'flex';
        linkGroupsSection.style.alignItems = settings.linksAlign === 'left' ? 'flex-start' : 
                                             settings.linksAlign === 'right' ? 'flex-end' : 'center';
        
        const quickLinks = document.querySelector('.quick-links');
        quickLinks.style.justifyContent = settings.linksAlign === 'left' ? 'flex-start' : 
                                          settings.linksAlign === 'right' ? 'flex-end' : 'center';
    } else {
        linkGroupsSection.style.display = 'none';
    }
    
    // Links position - reorder elements using flexbox order
    const linksPosition = settings.layout && settings.layout.linksPosition ? settings.layout.linksPosition : 'below-greeting';
    
    // Reset all orders first
    timeSection.style.order = '0';
    timezones.style.order = '0';
    greeting.style.order = '0';
    linkGroupsSection.style.order = '0';
    pomodoroWidget.style.order = '0';
    notesWidget.style.order = '0';
    
    // Set orders based on links position
    if (linksPosition === 'below-time') {
        timeSection.style.order = '1';
        timezones.style.order = '2';
        linkGroupsSection.style.order = '3';
        greeting.style.order = '4';
        pomodoroWidget.style.order = '5';
        notesWidget.style.order = '6';
    } else if (linksPosition === 'bottom') {
        timeSection.style.order = '1';
        timezones.style.order = '2';
        greeting.style.order = '3';
        pomodoroWidget.style.order = '4';
        notesWidget.style.order = '5';
        linkGroupsSection.style.order = '6';
    } else {
        // below-greeting (default)
        timeSection.style.order = '1';
        timezones.style.order = '2';
        greeting.style.order = '3';
        linkGroupsSection.style.order = '4';
        pomodoroWidget.style.order = '5';
        notesWidget.style.order = '6';
    }
    
    // Pomodoro visibility and alignment
    if (settings.pomodoroVisible) {
        pomodoroWidget.style.display = 'block';
        pomodoroWidget.style.alignSelf = settings.pomodoroAlign === 'left' ? 'flex-start' : 
                                         settings.pomodoroAlign === 'right' ? 'flex-end' : 'center';
    } else {
        pomodoroWidget.style.display = 'none';
    }
    
    // Notes visibility and alignment
    if (settings.notesVisible) {
        notesWidget.style.display = 'block';
        notesWidget.style.position = 'relative';
        notesWidget.style.alignSelf = settings.notesAlign === 'left' ? 'flex-start' : 
                                      settings.notesAlign === 'right' ? 'flex-end' : 'center';
    } else {
        notesWidget.style.display = 'none';
    }
    
    // Link size
    const linkItems = document.querySelectorAll('.link-item');
    linkItems.forEach(item => {
        item.classList.remove('size-compact', 'size-small', 'size-medium', 'size-large');
        
        const linkSize = settings.linkSize || 'compact';
        if (linkSize === 'compact') {
            item.classList.add('size-compact');
        } else if (linkSize === 'small') {
            item.classList.add('size-small');
        } else if (linkSize === 'large') {
            item.classList.add('size-large');
        } else {
            item.classList.add('size-medium');
        }
    });
}

function applyShadows() {
    const intensity = settings.shadowIntensity || 'medium';
    let shadowValue;
    
    switch(intensity) {
        case 'none':
            shadowValue = 'none';
            break;
        case 'subtle':
            shadowValue = '0 2px 8px rgba(0, 0, 0, 0.1)';
            break;
        case 'medium':
            shadowValue = '0 4px 12px rgba(0, 0, 0, 0.15)';
            break;
        case 'strong':
            shadowValue = '0 6px 20px rgba(0, 0, 0, 0.25)';
            break;
        default:
            shadowValue = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
    
    // Apply to link items
    document.querySelectorAll('.link-item').forEach(item => {
        item.style.boxShadow = shadowValue;
    });
    
    // Apply to active group tab
    document.querySelectorAll('.group-tab.active').forEach(tab => {
        tab.style.boxShadow = shadowValue;
    });
    
    // Apply to notes widget
    const notesWidget = document.querySelector('.notes-widget');
    if (notesWidget) {
        notesWidget.style.boxShadow = shadowValue;
    }
    
    // Apply to pomodoro widget
    const pomodoroWidget = document.querySelector('.pomodoro-widget');
    if (pomodoroWidget) {
        pomodoroWidget.style.boxShadow = shadowValue;
    }
}

function applySearchVisibility() {
    const searchBar = document.getElementById('search-bar');
    if (settings.searchVisible) {
        searchBar.classList.remove('hidden');
    } else {
        searchBar.classList.add('hidden');
    }
}


// Pomodoro Timer Functions
function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoro.timeLeft / 60);
    const seconds = pomodoro.timeLeft % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('pomodoro-display').textContent = display;
}

function startPomodoro() {
    if (!pomodoro.isRunning) {
        pomodoro.isRunning = true;
        pomodoro.interval = setInterval(() => {
            if (pomodoro.timeLeft > 0) {
                pomodoro.timeLeft--;
                updatePomodoroDisplay();
            } else {
                pausePomodoro();
                alert('Pomodoro completed!');
            }
        }, 1000);
    }
}

function pausePomodoro() {
    pomodoro.isRunning = false;
    if (pomodoro.interval) {
        clearInterval(pomodoro.interval);
        pomodoro.interval = null;
    }
}

function resetPomodoro() {
    pausePomodoro();
    pomodoro.timeLeft = pomodoro.duration;
    updatePomodoroDisplay();
}

function setPomodoroMode(mode) {
    pausePomodoro();
    pomodoro.mode = mode;
    
    if (mode === 'pomodoro') {
        pomodoro.duration = 25 * 60;
    } else if (mode === 'break') {
        pomodoro.duration = 5 * 60;
    } else if (mode === 'long') {
        pomodoro.duration = 15 * 60;
    }
    
    pomodoro.timeLeft = pomodoro.duration;
    updatePomodoroDisplay();
}
