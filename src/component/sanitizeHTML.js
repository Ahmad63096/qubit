// src/utils/sanitizeHTML.js
import DOMPurify from 'dompurify';

// Add a hook to automatically add target="_blank" and rel="noopener noreferrer" to all links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
    }
    
});

export const cleanHTML = (html) => {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'img'], // Add other tags as needed
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'src', 'alt', 'class', 'id', 'style'], // Add other attributes as needed
    });
};
