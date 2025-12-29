// js/main.js - 主JavaScript文件

// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 15px rgba(0,0,0,0.1)';
    }
});

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // 如果是首页内部链接
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 当前页面高亮
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('nav ul li a');
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        
        // 检查是否是当前页面
        if (currentPage.includes('specs.html') && itemHref === 'specs.html') {
            item.style.color = '#2a7a2a';
        } else if (currentPage.includes('blog/') && itemHref === 'blog/index.html') {
            item.style.color = '#2a7a2a';
        } else if (currentPage === '/' || currentPage.endsWith('index.html')) {
            if (itemHref === 'index.html' || itemHref === 'index.html#home') {
                item.style.color = '#2a7a2a';
            }
        }
    });
});