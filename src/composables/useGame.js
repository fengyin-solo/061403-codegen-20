import { ref, computed, onMounted, onUnmounted } from 'vue'

const EVENTS = {
  day3: {
    id: 'day3',
    title: '❓ 陌生的脚印',
    description: '第三天清晨，你在营地附近发现了一串陌生的脚印。它们通向密林深处，旁边似乎还散落着一些物品碎片。你决定……',
    choices: [
      {
        id: 'follow_trail',
        label: '🔍 循着脚印深入探索',
        description: '也许能找到其他幸存者或物资，但未知风险很高',
        effect: {
          modifiers: { woodGainMultiplier: 1.3, foodGainMultiplier: 1.3, tempCostMultiplier: 1.2 },
          blizzardChanceDelta: 0.05,
          endingTags: ['explorer'],
          instantLog: { type: 'success', message: '你发现了前人留下的营地遗迹，学到了高效采集技巧！（资源获取+30%，但行动体温消耗+20%）' }
        }
      },
      {
        id: 'strengthen_camp',
        label: '🏠 留在营地加固防御',
        description: '用木头搭建防风围栏，确保营地安全',
        effect: {
          modifiers: { heatRetention: 0.85, woodGainMultiplier: 0.9 },
          blizzardChanceDelta: -0.05,
          endingTags: ['builder'],
          instantLog: { type: 'success', message: '你搭建了坚固的防风围栏！（夜间热量消耗-15%，暴风雪概率-5%，但砍柴效率略降）' }
        }
      },
      {
        id: 'ignore_trail',
        label: '⚠️ 抹去脚印，谨慎观察',
        description: '保持低调，避免引来不必要的麻烦',
        effect: {
          modifiers: { huntSuccessBonus: 0.1 },
          blizzardChanceDelta: 0,
          endingTags: ['cautious'],
          instantLog: { type: 'info', message: '你抹去了脚印并在暗处观察。耐心是生存的关键。（狩猎成功率+10%）' }
        }
      }
    ]
  },
  day5: {
    id: 'day5',
    title: '🌩️ 天空异变',
    description: '第五天，天空的颜色变得异常阴沉。远处的云层呈现不祥的紫色，你感觉气候正在发生剧变……',
    choices: [
      {
        id: 'hoard_wood',
        label: '🪵 全力囤积木柴',
        description: '放弃今天的狩猎机会，拼命砍柴备荒',
        effect: {
          modifiers: { canHunt: false, woodGainMultiplier: 2.0, tempCostMultiplier: 1.1 },
          blizzardChanceDelta: 0.1,
          endingTags: ['hoarder'],
          instantLog: { type: 'warning', message: '你决定专注储备燃料！（砍柴收益翻倍，但无法再狩猎，暴风雪概率上升）' },
          instantResources: { wood: 15 }
        }
      },
      {
        id: 'hunt_frenzy',
        label: '🏹 抓紧大量狩猎',
        description: '趁还能行动，尽可能获取食物和兽皮',
        effect: {
          modifiers: { huntSuccessBonus: 0.2, foodGainMultiplier: 1.5, hideGainMultiplier: 1.5, woodGainMultiplier: 0.8 },
          blizzardChanceDelta: 0.05,
          endingTags: ['hunter'],
          instantLog: { type: 'warning', message: '你决定在风暴来临前尽可能狩猎！（狩猎率+20%，食物兽皮+50%）' }
        }
      },
      {
        id: 'craft_focus',
        label: '🔨 全力制作工具和保暖装备',
        description: '用现有材料打造高效工具和厚皮衣物',
        effect: {
          modifiers: { toolsEfficiencyBonus: 0.25, heatRetention: 0.8, toolCostMultiplier: 0.7 },
          blizzardChanceDelta: -0.03,
          endingTags: ['crafter'],
          instantLog: { type: 'success', message: '你制作了精制工具与保暖衣物！（工具效果+25%，制造成本-30%，热量流失-20%）' },
          instantResources: { tools: 2 }
        }
      }
    ]
  },
  day7: {
    id: 'day7',
    title: '👥 神秘的访客',
    description: '第七天傍晚，一位衣衫褴褛的旅人来到你的营地。他看起来饥寒交迫，同时眼中闪烁着精明的光……',
    choices: [
      {
        id: 'share_generously',
        label: '🤝 慷慨分享物资并接纳他',
        description: '善良或许能换来可靠的同伴',
        effect: {
          modifiers: { woodGainMultiplier: 1.5, foodGainMultiplier: 1.5, dailyFoodConsumption: 1 },
          blizzardChanceDelta: -0.08,
          endingTags: ['compassionate'],
          instantLog: { type: 'success', message: '旅人感激地加入了你的队伍！他是一位经验丰富的樵夫。（采集+50%，但每天多消耗1食物，暴风雪-8%）' },
          instantResources: { food: -3, wood: -3 }
        }
      },
      {
        id: 'trade_carefully',
        label: '💰 与他进行物资交易',
        description: '谨慎地交换物品，互不亏欠',
        effect: {
          modifiers: { huntSuccessBonus: 0.1, toolsEfficiencyBonus: 0.1 },
          blizzardChanceDelta: 0,
          endingTags: ['trader'],
          instantLog: { type: 'info', message: '你与旅人交换了生存技巧和物资。（狩猎+10%，工具效率+10%）' },
          instantResources: { food: -1, tools: 1 }
        }
      },
      {
        id: 'refuse_entry',
        label: '🚪 婉拒他，保持警惕',
        description: '在残酷的荒野中，多一个人就是多一份风险',
        effect: {
          modifiers: { heatRetention: 0.95, tempCostMultiplier: 0.9 },
          blizzardChanceDelta: 0.02,
          endingTags: ['lonewolf'],
          instantLog: { type: 'warning', message: '你拒绝了旅人。独自前行让你更加专注。（行动消耗-10%，热量流失-5%）' }
        }
      }
    ]
  },
  day10: {
    id: 'day10',
    title: '🌄 最终抉择',
    description: '第十天，远处的山峰传来奇怪的信号光。也许是救援队，也许是更大的危险。你的身体和物资都已到极限，必须做出最终决定……',
    choices: [
      {
        id: 'go_rescue',
        label: '🚶 冒险出发，向信号源前进',
        description: '赌上一切，也许这就是获救的机会',
        effect: {
          modifiers: { rescueChance: 0.6 },
          blizzardChanceDelta: 0.15,
          endingTags: ['rescue_seeker'],
          instantLog: { type: 'danger', message: '你踏上了前往信号源的旅途！路途艰险，但希望就在前方……（获救概率+60%，暴风雪风险剧增）' }
        }
      },
      {
        id: 'hold_fort',
        label: '🏔️ 坚守营地，继续求生',
        description: '信任自己积累的资源，稳扎稳打',
        effect: {
          modifiers: { survivalChance: 0.5, heatRetention: 0.7, canHunt: true, huntSuccessBonus: 0.15 },
          blizzardChanceDelta: -0.05,
          endingTags: ['survivor'],
          instantLog: { type: 'success', message: '你决定坚守自己建立的营地。（存活结局概率+50%，热量流失-30%）' }
        }
      },
      {
        id: 'solo_explore',
        label: '🧭 独自探索新的生存之地',
        description: '放弃营地，独自寻找更温暖的区域',
        effect: {
          modifiers: { wandererChance: 0.55, woodGainMultiplier: 0.7, foodGainMultiplier: 1.3, tempCostMultiplier: 1.3 },
          blizzardChanceDelta: 0,
          endingTags: ['wanderer'],
          instantLog: { type: 'info', message: '你背起行囊，踏上了流浪者的旅途……（漂泊结局+55%，机动性更高但更不稳定）' }
        }
      }
    ]
  }
}

export function useGame() {
  const temperature = ref(80)
  const heat = ref(50)
  const wood = ref(10)
  const food = ref(5)
  const hide = ref(0)
  const tools = ref(0)
  const isDay = ref(true)
  const dayCount = ref(1)
  const isBlizzard = ref(false)
  const gameOver = ref(false)
  const gameOverReason = ref('')
  const actionLog = ref([])

  const modifiers = ref({
    woodGainMultiplier: 1,
    foodGainMultiplier: 1,
    hideGainMultiplier: 1,
    tempCostMultiplier: 1,
    heatRetention: 1,
    huntSuccessBonus: 0,
    toolsEfficiencyBonus: 0,
    toolCostMultiplier: 1,
    canHunt: null,
    dailyFoodConsumption: 0,
    rescueChance: 0,
    survivalChance: 0,
    wandererChance: 0
  })
  const blizzardChanceDelta = ref(0)
  const endingTags = ref([])
  const triggeredEvents = ref([])
  const currentEvent = ref(null)

  const BASE_BLIZZARD_CHANCE = 0.15
  const DAY_DURATION = 30000
  const NIGHT_DURATION = 20000
  const HEAT_CONSUMPTION_RATE = 2

  let dayNightTimer = null
  let nightConsumptionTimer = null
  let autoSaveTimer = null

  const isNight = computed(() => !isDay.value)
  const isDanger = computed(() => temperature.value < 30)
  const canMakeFire = computed(() => wood.value >= 3)
  const effectiveCanHunt = computed(() => {
    if (modifiers.value.canHunt === false) return false
    return tools.value > 0
  })
  const huntSuccessRate = computed(() => {
    const base = 0.3 + tools.value * 0.15 * (1 + modifiers.value.toolsEfficiencyBonus)
    return Math.min(0.95, base + modifiers.value.huntSuccessBonus)
  })
  const effectiveBlizzardChance = computed(() => {
    return Math.max(0, Math.min(0.9, BASE_BLIZZARD_CHANCE + blizzardChanceDelta.value))
  })

  function addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString()
    actionLog.value.unshift({ message, type, timestamp })
    if (actionLog.value.length > 20) {
      actionLog.value.pop()
    }
  }

  function applyModifiers(newMods) {
    modifiers.value = { ...modifiers.value, ...newMods }
  }

  function applyInstantResources(resources) {
    if (!resources) return
    if (resources.wood) wood.value = Math.max(0, wood.value + resources.wood)
    if (resources.food) food.value = Math.max(0, food.value + resources.food)
    if (resources.hide) hide.value = Math.max(0, hide.value + resources.hide)
    if (resources.tools) tools.value = Math.max(0, tools.value + resources.tools)
    if (resources.heat) heat.value = Math.max(0, Math.min(100, heat.value + resources.heat))
    if (resources.temperature) temperature.value = Math.max(0, Math.min(100, temperature.value + resources.temperature))
  }

  function resolveEventChoice(choice) {
    if (!currentEvent.value || !choice) return

    const effect = choice.effect
    if (effect.modifiers) applyModifiers(effect.modifiers)
    if (typeof effect.blizzardChanceDelta === 'number') {
      blizzardChanceDelta.value += effect.blizzardChanceDelta
    }
    if (effect.endingTags && Array.isArray(effect.endingTags)) {
      endingTags.value = [...endingTags.value, ...effect.endingTags]
    }
    if (effect.instantLog) {
      addLog(effect.instantLog.message, effect.instantLog.type || 'info')
    }
    if (effect.instantResources) {
      applyInstantResources(effect.instantResources)
    }

    triggeredEvents.value.push(currentEvent.value.id)
    currentEvent.value = null
  }

  function checkAndTriggerEvent() {
    if (gameOver.value || currentEvent.value) return
    const day = dayCount.value

    let eventToTrigger = null
    if (day === 3 && !triggeredEvents.value.includes('day3')) eventToTrigger = EVENTS.day3
    else if (day === 5 && !triggeredEvents.value.includes('day5')) eventToTrigger = EVENTS.day5
    else if (day === 7 && !triggeredEvents.value.includes('day7')) eventToTrigger = EVENTS.day7
    else if (day === 10 && !triggeredEvents.value.includes('day10')) eventToTrigger = EVENTS.day10

    if (eventToTrigger) {
      currentEvent.value = eventToTrigger
      addLog(`⚡ 关键事件：${eventToTrigger.title}`, 'action')
    }
  }

  function determineEnding() {
    const tags = endingTags.value
    if (tags.includes('rescue_seeker')) {
      const success = Math.random() < (0.5 + modifiers.value.rescueChance * 0.5)
      if (success) {
        gameOverReason.value = '🌟 完美结局：你历经艰险终于抵达信号源，救援队直升机的轰鸣声划破了风雪的寂静。你活下来了，并把这段经历写成了《雪原生还录》。'
      } else {
        gameOverReason.value = '💔 悲剧结局：信号源只是一片废弃的科考站残骸。你耗尽了最后的体力，在冰冷的仪器旁永远地合上了双眼。'
      }
    } else if (tags.includes('wanderer')) {
      const success = Math.random() < (0.4 + modifiers.value.wandererChance * 0.5)
      if (success) {
        gameOverReason.value = '🏞️ 流浪者结局：你穿越了茫茫雪原，在山的另一边找到了一片四季如春的隐秘山谷。你在这里开始了新的生活，雪原成为传说。'
      } else {
        gameOverReason.value = '🥶 迷失结局：无尽的雪原让你彻底失去了方向。你在白茫茫的天地间行走，直到再也走不动为止。'
      }
    } else if (tags.includes('survivor') || tags.includes('builder') || tags.includes('crafter')) {
      const success = Math.random() < (0.55 + modifiers.value.survivalChance * 0.4)
      if (success) {
        gameOverReason.value = '🏠 坚守结局：你的营地成为了暴风雪中的一座灯塔。春天来临时，路过的猎人发现了你。你活了下来，并成为了传奇的"雪原之主"。'
      } else {
        gameOverReason.value = '🧊 冰封结局：你顽强地坚守到最后一刻，但这场严冬比所有人预想的都要漫长。你的营地成了一座冰封的纪念碑。'
      }
    } else if (tags.includes('hunter') || tags.includes('lonewolf')) {
      const success = Math.random() < 0.5
      if (success) {
        gameOverReason.value = '🏹 独狼结局：你靠着自己的猎技和冷酷的判断，一个人挺过了整个冬天。第二年春天，你踏上了归乡的路。'
      } else {
        gameOverReason.value = '🐺 荒野结局：在一次外出狩猎中，你遇到了同样在求生的狼群。雪原的法则终究没有站在你这边。'
      }
    } else if (tags.includes('compassionate') || tags.includes('trader')) {
      gameOverReason.value = '👥 同伴结局：你和伙伴们互相扶持，最终一起等到了救援。在绝境中，善良成为了你们最强大的武器。'
    } else if (tags.includes('hoarder')) {
      const success = Math.random() < 0.45
      if (success) {
        gameOverReason.value = '🔥 囤积者结局：你堆积如山的木柴让你度过了一个又一个极寒之夜。当春天来临，你是整个雪原唯一仍有余温的人。'
      } else {
        gameOverReason.value = '🪵 枯木结局：你囤积的木柴最终还是烧完了，而你早已因为长期不狩猎而失去了获取食物的能力。'
      }
    } else if (tags.includes('explorer')) {
      gameOverReason.value = '🗺️ 探索者结局：你在探索中发现了一个古老的地堡，里面竟然还有几十年前的罐头和燃料。你不仅活了下来，还发现了一段被遗忘的历史。'
    } else if (tags.includes('cautious')) {
      gameOverReason.value = '🐢 谨慎结局：你步步为营，没有犯任何重大错误。虽然过程缓慢而乏味，但你最终安然等到了救援。'
    } else {
      gameOverReason.value = '❄️ 未知结局：你的故事和这片雪原融为一体，没有人知道最后发生了什么。'
    }
  }

  function checkGameOver() {
    if (temperature.value <= 20) {
      gameOver.value = true
      if (endingTags.value.length > 0) {
        determineEnding()
      } else {
        gameOverReason.value = '体温过低，你在严寒中失去了意识...'
      }
      stopTimers()
      addLog('游戏结束：体温过低！', 'danger')
    }
    if (food.value < 0) food.value = 0
    if (temperature.value >= 100) temperature.value = 100
  }

  function consumeHeat() {
    if (gameOver.value) return

    const blizzardMultiplier = isBlizzard.value ? 2 : 1
    const retention = modifiers.value.heatRetention
    const consumption = HEAT_CONSUMPTION_RATE * blizzardMultiplier * retention

    if (modifiers.value.dailyFoodConsumption > 0 && food.value > 0 && isDay.value) {
    }

    if (heat.value >= consumption) {
      heat.value -= consumption
      if (temperature.value < 80) {
        temperature.value = Math.min(80, temperature.value + 1)
      }
    } else {
      heat.value = 0
      temperature.value = Math.max(0, temperature.value - consumption)
      addLog('热量不足！体温正在下降...', 'warning')
    }

    checkGameOver()
  }

  function startNightCycle() {
    addLog(`夜幕降临，第 ${dayCount.value} 天结束`, 'info')

    if (modifiers.value.dailyFoodConsumption > 0) {
      const consume = modifiers.value.dailyFoodConsumption
      if (food.value >= consume) {
        food.value -= consume
        addLog(`同伴消耗了 ${consume} 食物`, 'info')
      } else if (food.value > 0) {
        addLog(`食物不足，同伴饿着肚子熬过了夜晚`, 'warning')
        food.value = 0
      }
    }

    nightConsumptionTimer = setInterval(() => {
      consumeHeat()
    }, 1000)

    if (Math.random() < effectiveBlizzardChance.value) {
      triggerBlizzard()
    }
  }

  function startDayCycle() {
    dayCount.value++
    addLog(`天亮了，第 ${dayCount.value} 天开始`, 'success')
    isBlizzard.value = false
    if (nightConsumptionTimer) {
      clearInterval(nightConsumptionTimer)
      nightConsumptionTimer = null
    }

    checkAndTriggerEvent()
  }

  function toggleDayNight() {
    isDay.value = !isDay.value
    if (isDay.value) {
      startDayCycle()
    } else {
      startNightCycle()
    }
  }

  function triggerBlizzard() {
    isBlizzard.value = true
    addLog('⚠️ 暴风雪来袭！所有消耗加倍！', 'danger')
  }

  function chopWood() {
    if (gameOver.value || isNight.value) return

    const blizzardMultiplier = isBlizzard.value ? 2 : 1
    const tempCost = 5 * blizzardMultiplier * modifiers.value.tempCostMultiplier

    temperature.value = Math.max(0, temperature.value - tempCost)
    const baseWood = Math.floor(Math.random() * 3) + 2
    const woodGained = Math.max(1, Math.floor(baseWood * modifiers.value.woodGainMultiplier))
    wood.value += woodGained

    addLog(`砍柴：获得 ${woodGained} 木头，消耗 ${Math.round(tempCost)} 体温`, 'action')

    if (Math.random() < effectiveBlizzardChance.value * 0.5) {
      triggerBlizzard()
    }

    checkGameOver()
  }

  function hunt() {
    if (gameOver.value || isNight.value) return
    if (!effectiveCanHunt.value) {
      addLog('当前无法进行狩猎！', 'warning')
      return
    }

    const blizzardMultiplier = isBlizzard.value ? 2 : 1
    const tempCost = 8 * blizzardMultiplier * modifiers.value.tempCostMultiplier

    temperature.value = Math.max(0, temperature.value - tempCost)

    if (Math.random() < huntSuccessRate.value) {
      const baseFood = Math.floor(Math.random() * 3) + 2
      const baseHide = Math.floor(Math.random() * 2) + 1
      const foodGained = Math.max(1, Math.floor(baseFood * modifiers.value.foodGainMultiplier))
      const hideGained = Math.max(1, Math.floor(baseHide * modifiers.value.hideGainMultiplier))
      food.value += foodGained
      hide.value += hideGained
      addLog(`狩猎成功：获得 ${foodGained} 食物，${hideGained} 兽皮，消耗 ${Math.round(tempCost)} 体温`, 'success')
    } else {
      addLog(`狩猎失败：消耗 ${Math.round(tempCost)} 体温，空手而归`, 'warning')
    }

    if (Math.random() < effectiveBlizzardChance.value * 0.5) {
      triggerBlizzard()
    }

    checkGameOver()
  }

  function makeTools() {
    if (gameOver.value || isNight.value) return
    const costMult = modifiers.value.toolCostMultiplier
    const needWood = Math.max(1, Math.ceil(2 * costMult))
    const needHide = Math.max(1, Math.ceil(1 * costMult))
    if (wood.value < needWood || hide.value < needHide) {
      addLog(`材料不足：需要 ${needWood} 木头和 ${needHide} 兽皮`, 'warning')
      return
    }

    const blizzardMultiplier = isBlizzard.value ? 2 : 1
    const tempCost = 6 * blizzardMultiplier * modifiers.value.tempCostMultiplier

    wood.value -= needWood
    hide.value -= needHide
    tools.value += 1
    temperature.value = Math.max(0, temperature.value - tempCost)

    addLog(`制作工具：获得 1 工具，消耗 ${Math.round(tempCost)} 体温`, 'success')
    checkGameOver()
  }

  function makeFire() {
    if (gameOver.value || !canMakeFire.value) {
      addLog('木头不足：生火需要 3 木头', 'warning')
      return
    }

    wood.value -= 3
    const heatGained = Math.floor(Math.random() * 20) + 25
    heat.value = Math.min(100, heat.value + heatGained)
    temperature.value = Math.min(100, temperature.value + 10)

    addLog(`生火：获得 ${heatGained} 热量，体温上升 10`, 'success')
  }

  function eatFood() {
    if (gameOver.value || food.value < 1) {
      addLog('没有食物了！', 'warning')
      return
    }

    food.value -= 1
    const tempGained = Math.floor(Math.random() * 10) + 5
    temperature.value = Math.min(100, temperature.value + tempGained)

    addLog(`进食：体温恢复 ${tempGained}`, 'success')
  }

  function startTimers() {
    dayNightTimer = setInterval(() => {
      toggleDayNight()
    }, isDay.value ? DAY_DURATION : NIGHT_DURATION)

    autoSaveTimer = setInterval(() => {
      saveGame('auto')
    }, 10000)
  }

  function stopTimers() {
    if (dayNightTimer) {
      clearInterval(dayNightTimer)
      dayNightTimer = null
    }
    if (nightConsumptionTimer) {
      clearInterval(nightConsumptionTimer)
      nightConsumptionTimer = null
    }
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer)
      autoSaveTimer = null
    }
  }

  function saveGame(slot = 'manual') {
    const gameState = {
      temperature: temperature.value,
      heat: heat.value,
      wood: wood.value,
      food: food.value,
      hide: hide.value,
      tools: tools.value,
      isDay: isDay.value,
      dayCount: dayCount.value,
      isBlizzard: isBlizzard.value,
      modifiers: modifiers.value,
      blizzardChanceDelta: blizzardChanceDelta.value,
      endingTags: endingTags.value,
      triggeredEvents: triggeredEvents.value,
      currentEventId: currentEvent.value ? currentEvent.value.id : null,
      gameOver: gameOver.value,
      gameOverReason: gameOverReason.value,
      savedAt: Date.now()
    }
    localStorage.setItem(`snowSurvival_${slot}`, JSON.stringify(gameState))
    addLog(`游戏已保存到存档位：${slot === 'auto' ? '自动存档' : slot}`, 'info')
  }

  function loadGame(slot = 'auto') {
    const saved = localStorage.getItem(`snowSurvival_${slot}`)
    if (!saved) {
      addLog('没有找到存档', 'warning')
      return false
    }

    try {
      const gameState = JSON.parse(saved)
      temperature.value = gameState.temperature
      heat.value = gameState.heat
      wood.value = gameState.wood
      food.value = gameState.food
      hide.value = gameState.hide
      tools.value = gameState.tools
      isDay.value = gameState.isDay
      dayCount.value = gameState.dayCount
      isBlizzard.value = gameState.isBlizzard
      modifiers.value = gameState.modifiers || modifiers.value
      blizzardChanceDelta.value = gameState.blizzardChanceDelta || 0
      endingTags.value = gameState.endingTags || []
      triggeredEvents.value = gameState.triggeredEvents || []
      gameOver.value = !!gameState.gameOver
      gameOverReason.value = gameState.gameOverReason || ''
      actionLog.value = []

      if (gameState.currentEventId && EVENTS[gameState.currentEventId]) {
        currentEvent.value = EVENTS[gameState.currentEventId]
      } else {
        currentEvent.value = null
      }

      stopTimers()

      if (!gameOver.value) {
        startTimers()

        if (!isDay.value) {
          startNightCycle()
        } else {
          if (!currentEvent.value) {
            checkAndTriggerEvent()
          }
        }
      }

      addLog(`成功加载存档：${slot === 'auto' ? '自动存档' : slot}（第 ${dayCount.value} 天）`, 'success')
      return true
    } catch (e) {
      console.error('loadGame error:', e)
      addLog('存档损坏，无法加载', 'danger')
      return false
    }
  }

  function getSaveSlots() {
    const slots = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('snowSurvival_')) {
        const slotName = key.replace('snowSurvival_', '')
        try {
          const data = JSON.parse(localStorage.getItem(key))
          slots.push({
            name: slotName,
            dayCount: data.dayCount,
            savedAt: data.savedAt
          })
        } catch (e) {}
      }
    }
    return slots
  }

  function deleteSave(slot) {
    localStorage.removeItem(`snowSurvival_${slot}`)
    addLog(`已删除存档：${slot}`, 'info')
  }

  function restartGame() {
    temperature.value = 80
    heat.value = 50
    wood.value = 10
    food.value = 5
    hide.value = 0
    tools.value = 0
    isDay.value = true
    dayCount.value = 1
    isBlizzard.value = false
    gameOver.value = false
    gameOverReason.value = ''
    actionLog.value = []
    modifiers.value = {
      woodGainMultiplier: 1,
      foodGainMultiplier: 1,
      hideGainMultiplier: 1,
      tempCostMultiplier: 1,
      heatRetention: 1,
      huntSuccessBonus: 0,
      toolsEfficiencyBonus: 0,
      toolCostMultiplier: 1,
      canHunt: null,
      dailyFoodConsumption: 0,
      rescueChance: 0,
      survivalChance: 0,
      wandererChance: 0
    }
    blizzardChanceDelta.value = 0
    endingTags.value = []
    triggeredEvents.value = []
    currentEvent.value = null

    localStorage.removeItem('snowSurvival_auto')

    stopTimers()
    startTimers()

    addLog('新游戏开始！祝你好运！', 'success')
  }

  onMounted(() => {
    const hasAutoSave = !!localStorage.getItem('snowSurvival_auto')
    if (hasAutoSave) {
      const loaded = loadGame('auto')
      if (!loaded) {
        addLog('欢迎来到雪地生存！白天收集资源，夜晚保持温暖。关键天数将出现重大抉择！', 'info')
      }
    } else {
      startTimers()
      addLog('欢迎来到雪地生存！白天收集资源，夜晚保持温暖。关键天数将出现重大抉择！', 'info')
    }
  })

  onUnmounted(() => {
    stopTimers()
  })

  return {
    temperature,
    heat,
    wood,
    food,
    hide,
    tools,
    isDay,
    isNight,
    dayCount,
    isBlizzard,
    gameOver,
    gameOverReason,
    actionLog,
    isDanger,
    canMakeFire,
    canHunt: effectiveCanHunt,
    huntSuccessRate,
    currentEvent,
    triggeredEvents,
    endingTags,
    chopWood,
    hunt,
    makeTools,
    makeFire,
    eatFood,
    resolveEventChoice,
    saveGame,
    loadGame,
    getSaveSlots,
    deleteSave,
    restartGame
  }
}
