// js/blog-generator.js - Blog generator for UnigDesign Golf Shafts Blog

document.addEventListener('DOMContentLoaded', function() {
    generateBlogList();
    initBlogImages();
});

function generateBlogList() {
    const blogContainer = document.getElementById('blog-articles-container');
    
    if (!blogContainer) return;
    
    let blogHTML = '';
    
    if (!blogArticles || !Array.isArray(blogArticles) || blogArticles.length === 0) {
        blogHTML = `
            <div class="no-articles">
                <h3>Geen artikelen gevonden</h3>
                <p>Er zijn momenteel geen blog artikelen beschikbaar.</p>
            </div>
        `;
        blogContainer.innerHTML = blogHTML;
        return;
    }
    
    blogArticles.forEach(article => {
        const dateStr = formatDutchDate(article.date);
        
        blogHTML += `
            <article class="blog-article-card" itemscope itemtype="https://schema.org/Article">
                <div class="blog-article-image">
                    <picture>
                        <source srcset="${article.image.replace('.jpg', '.webp')}" type="image/webp">
                        <img src="${article.image}" alt="${article.title}" 
                             itemprop="image" loading="lazy" width="350" height="200">
                    </picture>
                </div>
                <div class="blog-article-content" itemprop="articleBody">
                    <div class="blog-article-meta">
                        <time class="blog-article-date" datetime="${article.date}" itemprop="datePublished">
                            ${dateStr}
                        </time>
                        <span class="blog-article-category" itemprop="articleSection">${article.category}</span>
                    </div>
                    <h3 itemprop="headline">${article.title}</h3>
                    <p itemprop="description">${article.excerpt}</p>
                    <a href="article.html?id=${article.id}" class="read-more-btn" itemprop="url" 
                       aria-label="Lees het volledige artikel: ${article.title}">
                        Lees volledig artikel →
                    </a>
                </div>
            </article>
        `;
    });
    
    blogContainer.innerHTML = blogHTML;
    
    addBlogStructuredData(blogArticles);
    trackBlogClicks();
}

function formatDutchDate(dateStr) {
    if (!dateStr) return '';
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const dutchMonths = [
            'januari', 'februari', 'maart', 'april', 'mei', 'juni',
            'juli', 'augustus', 'september', 'oktober', 'november', 'december'
        ];
        
        return `${day} ${dutchMonths[month]} ${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateStr;
    }
}

function addBlogStructuredData(articles) {
    if (!articles || !Array.isArray(articles) || articles.length === 0) return;
    
    const blogListSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "UnigDesign Golf Shafts Blog",
        "description": "Expert inzichten over golf schacht technologie, equipment trends en prestatie optimalisatie",
        "url": window.location.href,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": articles.length,
            "itemListElement": articles.map((article, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Article",
                    "headline": article.title,
                    "description": article.excerpt,
                    "image": article.image,
                    "datePublished": article.date,
                    "dateModified": article.date,
                    "author": {
                        "@type": "Organization",
                        "name": "UnigDesign"
                    }
                }
            }))
        }
    };
    
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema) {
        existingSchema.remove();
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(blogListSchema, null, 2);
    document.head.appendChild(script);
}

function initBlogImages() {
    const images = document.querySelectorAll('.blog-article-image img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.addEventListener('load', function() {
                this.style.opacity = 1;
            });
        } else {
            img.style.opacity = 1;
        }
    });
}

function trackBlogClicks() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const articleTitle = this.closest('.blog-article-card').querySelector('h3').textContent;
            console.log('Blog article clicked:', articleTitle);
        });
    });
}

function searchBlogArticles(query) {
    if (!query || !blogArticles) return [];
    
    const searchTerm = query.toLowerCase();
    
    return blogArticles.filter(article => {
        return article.title.toLowerCase().includes(searchTerm) ||
               article.excerpt.toLowerCase().includes(searchTerm) ||
               article.category.toLowerCase().includes(searchTerm) ||
               (article.content && article.content.toLowerCase().includes(searchTerm));
    });
}

function filterBlogByCategory(category) {
    if (!category || !blogArticles) return blogArticles;
    
    return blogArticles.filter(article => 
        article.category.toLowerCase() === category.toLowerCase()
    );
}

function getLatestArticles(limit = 3) {
    if (!blogArticles) return [];
    
    return [...blogArticles]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

function getRelatedArticles(currentArticleId, limit = 2) {
    if (!blogArticles || !currentArticleId) return [];
    
    const currentArticle = blogArticles.find(a => a.id === currentArticleId);
    if (!currentArticle) return [];
    
    return blogArticles
        .filter(article => 
            article.id !== currentArticleId && 
            article.category === currentArticle.category
        )
        .slice(0, limit);
}