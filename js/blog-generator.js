// js/blog-generator.js
document.addEventListener('DOMContentLoaded', function() {
    // 生成博客列表
    generateBlogList();
});

// 生成博客列表
function generateBlogList() {
    const blogContainer = document.getElementById('blog-articles-container');
    
    if (!blogContainer) return;
    
    let blogHTML = '';
    
    blogArticles.forEach(article => {
        // 将YYYY-MM-DD格式转换为中文日期格式
        const dateStr = formatDate(article.date);
        
        blogHTML += `
            <div class="blog-article-card">
                <div class="blog-article-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="blog-article-content">
                    <div class="blog-article-meta">
                        <span class="blog-article-date">${dateStr}</span>
                        <span class="blog-article-category">${article.category}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <a href="article.html?id=${article.id}" class="read-more-btn">阅读全文 →</a>
                </div>
            </div>
        `;
    });
    
    blogContainer.innerHTML = blogHTML;
}

// 将YYYY-MM-DD格式转换为中文日期格式
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}年${month}月${day}日`;
}