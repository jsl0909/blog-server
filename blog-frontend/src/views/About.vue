<template>
  <div class="about">
    <div class="content-card">
      <h1>关于我</h1>
      <div class="about-content">
        <p>
          我是一名热爱技术的软件工程师，专注于前端开发和用户体验设计。
          喜欢探索新技术，分享技术心得，记录成长历程。
        </p>
        <p>
          在这个博客中，我会分享我在技术路上的所思所得，包括但不限于：
          前端框架、性能优化、设计模式、架构思考等内容。
        </p>
        <p>
          希望通过技术分享，能够帮助到更多的开发者，也欢迎大家与我交流讨论。
        </p>
      </div>
      
      <div class="skills-section">
        <h2>技能领域</h2>
        <div class="skills-grid">
          <div class="skill-item">前端开发</div>
          <div class="skill-item">Vue.js</div>
          <div class="skill-item">React</div>
          <div class="skill-item">TypeScript</div>
          <div class="skill-item">Node.js</div>
          <div class="skill-item">UI/UX设计</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page logic
</script>

<style scoped>
.about {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.content-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.about-content p {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #666;
  margin-bottom: 24px;
}

.skills-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #f0f0f0;
}

.skills-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.skill-item {
  background: #f8f9fa;
  color: #666;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid #f0f0f0;
}

.skill-item:hover {
  background: #333;
  color: #fff;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about {
    padding: 20px 15px;
  }
  
  .content-card {
    padding: 40px 30px;
    margin: 0 10px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .about-content p {
    font-size: 1rem;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 30px 20px;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 