<template>
  <div class="game-over-overlay">
    <div class="game-over-content" :class="endingStyleClass">
      <div class="skull-icon">{{ endingIcon }}</div>
      <h2 class="game-over-title">{{ endingTitle }}</h2>
      <p class="game-over-reason">{{ reason }}</p>
      <div v-if="endingTags && endingTags.length > 0" class="ending-tags">
        <span class="tag-label">你的抉择：</span>
        <span v-for="tag in displayTags" :key="tag" class="ending-tag">{{ tag }}</span>
      </div>
      <div class="final-stats">
        <div class="stat-item">
          <span class="stat-label">存活天数</span>
          <span class="stat-value">{{ dayCount }} 天</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">最终体温</span>
          <span class="stat-value">{{ temperature }}°C</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">收集木头</span>
          <span class="stat-value">{{ wood }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">制作工具</span>
          <span class="stat-value">{{ tools }}</span>
        </div>
      </div>
      <div class="game-over-actions">
        <button class="action-btn restart" @click="$emit('restart')">
          🔄 重新开始
        </button>
        <button class="action-btn load" @click="$emit('load')">
          📂 读取存档
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  reason: {
    type: String,
    default: ''
  },
  dayCount: {
    type: Number,
    default: 1
  },
  temperature: {
    type: Number,
    default: 0
  },
  wood: {
    type: Number,
    default: 0
  },
  tools: {
    type: Number,
    default: 0
  },
  endingTags: {
    type: Array,
    default: () => []
  }
})

defineEmits(['restart', 'load'])

const TAG_LABELS = {
  explorer: '🧭 探索者',
  builder: '🏠 建设者',
  cautious: '🐢 谨慎派',
  hoarder: '🪵 囤积狂',
  hunter: '🏹 猎人',
  crafter: '🔨 工匠',
  compassionate: '🤝 共情者',
  trader: '💰 交易者',
  lonewolf: '🐺 独狼',
  rescue_seeker: '🚁 求援者',
  survivor: '🏔️ 坚守者',
  wanderer: '🧳 流浪者'
}

const isGoodEnding = computed(() => {
  const positive = ['完美结局', '坚守结局', '流浪者结局', '独狼结局', '同伴结局', '囤积者结局', '探索者结局', '谨慎结局']
  return positive.some(k => props.reason.includes(k))
})

const endingIcon = computed(() => {
  if (!props.reason) return '💀'
  if (props.reason.includes('完美结局')) return '🌟'
  if (props.reason.includes('坚守结局')) return '🏠'
  if (props.reason.includes('流浪者结局')) return '🏞️'
  if (props.reason.includes('独狼结局')) return '🏹'
  if (props.reason.includes('同伴结局')) return '👥'
  if (props.reason.includes('囤积者结局')) return '🔥'
  if (props.reason.includes('探索者结局')) return '🗺️'
  if (props.reason.includes('谨慎结局')) return '🐢'
  if (props.reason.includes('悲剧结局')) return '💔'
  if (props.reason.includes('迷失结局')) return '🥶'
  if (props.reason.includes('冰封结局')) return '🧊'
  if (props.reason.includes('荒野结局')) return '🐺'
  if (props.reason.includes('枯木结局')) return '🪵'
  return '💀'
})

const endingTitle = computed(() => {
  if (!props.reason) return '游戏结束'
  const match = props.reason.match(/^(.+?)：/)
  return match ? match[1] : '游戏结束'
})

const endingStyleClass = computed(() => {
  return isGoodEnding.value ? 'good-ending' : 'bad-ending'
})

const displayTags = computed(() => {
  return (props.endingTags || [])
    .map(t => TAG_LABELS[t] || t)
    .slice(0, 4)
})
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-over-content {
  text-align: center;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.5s ease;
  max-width: 480px;
  width: 90%;
}

.game-over-content.bad-ending {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid rgba(231, 76, 60, 0.5);
  box-shadow: 0 0 50px rgba(231, 76, 60, 0.3);
}

.game-over-content.good-ending {
  background: linear-gradient(135deg, #1a3a2e, #1e4d3b);
  border: 2px solid rgba(46, 204, 113, 0.5);
  box-shadow: 0 0 50px rgba(46, 204, 113, 0.3);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skull-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.game-over-title {
  font-size: 36px;
  margin-bottom: 15px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.bad-ending .game-over-title {
  color: #e74c3c;
}

.good-ending .game-over-title {
  color: #2ecc71;
}

.game-over-reason {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.7;
}

.ending-tags {
  margin-bottom: 25px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tag-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 8px;
}

.ending-tag {
  display: inline-block;
  margin: 3px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.final-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  display: block;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.game-over-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.restart {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.action-btn.load {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
</style>
