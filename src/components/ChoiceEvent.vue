<template>
  <div class="choice-overlay">
    <div class="choice-content">
      <div class="choice-icon">⚡</div>
      <h2 class="choice-title">{{ event.title }}</h2>
      <p class="choice-description">{{ event.description }}</p>
      <div class="choices-list">
        <button
          v-for="(choice, index) in event.choices"
          :key="choice.id"
          class="choice-btn"
          :style="{ animationDelay: index * 0.1 + 's' }"
          @click="handleChoose(choice)"
        >
          <div class="choice-label">{{ choice.label }}</div>
          <div class="choice-desc">{{ choice.description }}</div>
        </button>
      </div>
      <div class="choice-hint">
        ⚠️ 你的选择将永久改变游戏规则和最终结局
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['choose'])

function handleChoose(choice) {
  emit('choose', choice)
}
</script>

<style scoped>
.choice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.choice-content {
  text-align: center;
  padding: 35px 40px;
  background: linear-gradient(135deg, #2c3e50, #1a1a2e);
  border-radius: 25px;
  border: 2px solid rgba(241, 196, 15, 0.4);
  box-shadow: 0 0 60px rgba(241, 196, 15, 0.2);
  animation: slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 560px;
  width: 92%;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.choice-icon {
  font-size: 70px;
  margin-bottom: 10px;
  animation: pulse 2.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

.choice-title {
  color: #f1c40f;
  font-size: 30px;
  margin-bottom: 18px;
  text-shadow: 0 0 25px rgba(241, 196, 15, 0.5);
  letter-spacing: 1px;
}

.choice-description {
  color: rgba(255, 255, 255, 0.88);
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 1.8;
  padding: 0 10px;
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 25px;
}

.choice-btn {
  padding: 18px 22px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: inherit;
  text-align: left;
  opacity: 0;
  animation: choiceFadeIn 0.5s ease forwards;
}

@keyframes choiceFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.choice-btn:hover {
  transform: translateX(8px) scale(1.02);
  background: linear-gradient(135deg, rgba(241, 196, 15, 0.25), rgba(231, 76, 60, 0.15));
  border-color: rgba(241, 196, 15, 0.7);
  box-shadow: 0 8px 30px rgba(241, 196, 15, 0.3);
}

.choice-btn:active {
  transform: translateX(4px) scale(0.98);
}

.choice-label {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 6px;
  color: #fff;
}

.choice-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
}

.choice-hint {
  color: rgba(231, 76, 60, 0.85);
  font-size: 12px;
  font-style: italic;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 600px) {
  .choice-content {
    padding: 25px 20px;
  }
  .choice-title {
    font-size: 22px;
  }
  .choice-description {
    font-size: 14px;
  }
  .choice-label {
    font-size: 15px;
  }
  .choice-desc {
    font-size: 12px;
  }
}
</style>
