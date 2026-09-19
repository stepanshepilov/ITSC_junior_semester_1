import { useState } from 'react'
import {
  ArrowUpRight, BookOpen, Check, ChevronDown, CirclePlay, Code2,
  GitBranch, GraduationCap, LayoutGrid, Menu, Search, Sparkles,
  Target, Terminal, X,
} from 'lucide-react'
import './App.css'

const weeks = [
  { id: 2, title: 'Первый Python', subtitle: 'Среда, алгоритмы и вход/выход', track: 'Старт', tone: 'coral', status: 'current', duration: '90 мин', icon: Terminal, theory: ['Алгоритмы', 'Переменные', 'Условия', 'Ошибки'], task: 'Соберите программу проверки наблюдений: ввод, обработка, понятный отчет.', file: 'hello_ml.py', code: `name = input("Название набора: ").strip()\nobservations = int(input("Наблюдения: "))\n\nif observations >= 10:\n    print(f"{name}: данных достаточно")\nelse:\n    print(f"{name}: нужно больше данных")` },
  { id: 3, title: 'Python + Git', subtitle: 'Циклы, функции и история изменений', track: 'Инструменты', tone: 'blue', status: 'next', duration: '90 мин', icon: GitBranch, theory: ['Циклы', 'Коллекции', 'Функции', 'Git'], task: 'Напишите набор функций статистики и проведите работу через отдельную Git-ветку.', file: 'statistics.py', code: `def mean(values):\n    if not values:\n        raise ValueError("empty input")\n    return sum(values) / len(values)\n\nprint(mean([2, 4, 8]))` },
  { id: 4, title: 'Данные как таблица', subtitle: 'NumPy, pandas и качество данных', track: 'Данные', tone: 'sage', status: 'next', duration: '100 мин', icon: LayoutGrid, theory: ['Массивы', 'DataFrame', 'Пропуски', 'Группировки'], task: 'Загрузите CSV, опишите столбцы, найдите пропуски и сформулируйте первое наблюдение.', file: 'data_inspection.ipynb', code: `import pandas as pd\n\ndf = pd.read_csv("data.csv")\nprint(df.shape)\nprint(df.isna().sum())\nprint(df.describe())` },
  { id: 5, title: 'Визуализация', subtitle: 'Вопросы к данным через графики', track: 'Данные', tone: 'yellow', status: 'locked', duration: '90 мин', icon: Sparkles, theory: ['Графики', 'EDA', 'Корреляция', 'Гипотезы'], task: 'Ответьте на 3 вопроса о датасете с помощью графиков и осторожных выводов.', file: 'eda_report.ipynb', code: `import matplotlib.pyplot as plt\n\ndf["score"].hist(bins=12)\nplt.title("Распределение score")\nplt.xlabel("score")\nplt.show()` },
  { id: 6, title: 'Что такое ML', subtitle: 'Признаки, target и baseline', track: 'ML core', tone: 'violet', status: 'locked', duration: '100 мин', icon: Target, theory: ['Supervised learning', 'Train/test', 'Baseline', 'Утечка'], task: 'Постройте честный baseline для задачи регрессии и зафиксируйте выбранную метрику.', file: 'baseline.ipynb', code: `from sklearn.dummy import DummyRegressor\n\nmodel = DummyRegressor(strategy="mean")\nmodel.fit(X_train, y_train)\nprint(model.score(X_test, y_test))` },
  { id: 7, title: 'Линейная регрессия', subtitle: 'Векторы, веса и MSE', track: 'ML core', tone: 'coral', status: 'locked', duration: '100 мин', icon: Target, theory: ['Векторы', 'MSE', 'Веса', 'Ошибки'], task: 'Предскажите числовой target и сравните модель с baseline.', file: 'linear_regression.ipynb', code: `from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)` },
  { id: 8, title: 'Классификация', subtitle: 'Классы, пороги и метрики', track: 'ML core', tone: 'blue', status: 'locked', duration: '100 мин', icon: Target, theory: ['Accuracy', 'Precision', 'Recall', 'F1'], task: 'Обучите классификатор, постройте confusion matrix и разберите ошибки.', file: 'classification.ipynb', code: `from sklearn.metrics import classification_report\n\nprint(classification_report(y_test, predictions))` },
  { id: 9, title: 'Честный эксперимент', subtitle: 'Pipeline и cross-validation', track: 'ML core', tone: 'sage', status: 'locked', duration: '100 мин', icon: GitBranch, theory: ['Scaling', 'Pipeline', 'CV', 'Seed'], task: 'Соберите единый pipeline и сравните две модели без утечки данных.', file: 'model_pipeline.ipynb', code: `from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\n\nmodel = make_pipeline(StandardScaler(), LinearRegression())\nmodel.fit(X_train, y_train)` },
  { id: 10, title: 'Деревья и ансамбли', subtitle: 'Сложность модели и переобучение', track: 'ML core', tone: 'yellow', status: 'locked', duration: '90 мин', icon: LayoutGrid, theory: ['Decision tree', 'Random forest', 'Overfit', 'Feature importance'], task: 'Сравните линейную модель, дерево и лес, наблюдая за train/validation score.', file: 'tree_models.ipynb', code: `from sklearn.ensemble import RandomForestClassifier\n\nmodel = RandomForestClassifier(\n    n_estimators=100, max_depth=4, random_state=42\n)` },
  { id: 11, title: 'Без учителя', subtitle: 'Кластеры и промежуточный проект', track: 'Проект', tone: 'violet', status: 'locked', duration: '120 мин', icon: Sparkles, theory: ['K-means', 'Расстояние', 'PCA', 'Ограничения'], task: 'Сгруппируйте объекты без target и защитите короткий проект.', file: 'clustering_project.ipynb', code: `from sklearn.cluster import KMeans\n\nclusters = KMeans(n_clusters=3, random_state=42)\nlabels = clusters.fit_predict(X_scaled)` },
  { id: 12, title: 'Нейронные сети', subtitle: 'Нейрон, слой и MLP', track: 'Deep learning', tone: 'coral', status: 'locked', duration: '100 мин', icon: Sparkles, theory: ['Activation', 'Layer', 'MLP', 'Loss'], task: 'Обучите MLP на нелинейной задаче и сравните его с линейной моделью.', file: 'mlp_intro.ipynb', code: `import torch.nn as nn\n\nmodel = nn.Sequential(\n    nn.Linear(2, 8),\n    nn.ReLU(),\n    nn.Linear(8, 1)\n)` },
  { id: 13, title: 'Градиентный спуск', subtitle: 'PyTorch и training loop', track: 'Deep learning', tone: 'blue', status: 'locked', duration: '110 мин', icon: Code2, theory: ['Производная', 'Градиент', 'Learning rate', 'Backprop'], task: 'Реализуйте маленький градиентный спуск и перенесите идею в PyTorch.', file: 'gradient_descent.ipynb', code: `for features, targets in loader:\n    optimizer.zero_grad()\n    predictions = model(features)\n    loss = loss_fn(predictions, targets)\n    loss.backward()\n    optimizer.step()` },
  { id: 14, title: 'Последовательности', subtitle: 'Окна, лаги и baseline', track: 'Sequences', tone: 'sage', status: 'locked', duration: '90 мин', icon: LayoutGrid, theory: ['Окно', 'Временной ряд', 'Token', 'Embedding'], task: 'Превратите ряд или текст в пары «окно → следующий элемент».', file: 'sequence_data.ipynb', code: `def make_windows(series, size):\n    X, y = [], []\n    for index in range(len(series) - size):\n        X.append(series[index:index + size])\n        y.append(series[index + size])\n    return X, y` },
  { id: 15, title: 'Простая RNN', subtitle: 'Hidden state и контекст', track: 'Sequences', tone: 'yellow', status: 'locked', duration: '110 мин', icon: Code2, theory: ['RNN', 'Hidden state', 'Sequence-to-one', 'LSTM'], task: 'Обучите маленькую RNN и сравните пять предсказаний с baseline.', file: 'rnn_baseline.ipynb', code: `class SequenceModel(nn.Module):\n    def __init__(self, features, hidden):\n        super().__init__()\n        self.rnn = nn.RNN(features, hidden, batch_first=True)\n        self.head = nn.Linear(hidden, 1)` },
  { id: 16, title: 'Финальный проект', subtitle: 'Эксперимент от вопроса до защиты', track: 'Финал', tone: 'violet', status: 'locked', duration: '150 мин', icon: GraduationCap, theory: ['Воспроизводимость', 'Метрики', 'Ошибки', 'Защита'], task: 'Соберите репозиторий, отчет и защиту на 5–7 минут.', file: 'final_project.ipynb', code: `# README проекта\n\nquestion = "Что мы хотим узнать?"\nbaseline = "С чем сравниваем?"\nresult = "Что показал эксперимент?"` },
]

const navItems = [
  { id: 'overview', label: 'Обзор курса' },
  { id: 'weeks', label: 'Недели' },
  { id: 'practice', label: 'Практика' },
  { id: 'projects', label: 'Проекты' },
]

function App() {
  const [selectedId, setSelectedId] = useState(2)
  const [activeTab, setActiveTab] = useState('Теория')
  const [activeNav, setActiveNav] = useState('overview')
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [completed, setCompleted] = useState([])
  const selected = weeks.find((week) => week.id === selectedId) || weeks[0]
  const SelectedIcon = selected.icon
  const filteredWeeks = weeks.filter((week) => `${week.title} ${week.subtitle} ${week.track}`.toLowerCase().includes(query.toLowerCase()))
  const progress = Math.round((completed.length / weeks.length) * 100)
  const toggleComplete = () => setCompleted((current) => current.includes(selected.id) ? current.filter((id) => id !== selected.id) : [...current, selected.id])
  const handleNav = (id) => {
    setActiveNav(id)
    if (id === 'practice') {
      setSelectedId(2)
      setActiveTab('Практика')
    } else if (id === 'projects') {
      setSelectedId(11)
      setActiveTab('Практика')
    } else {
      setSelectedId(2)
      setActiveTab('Теория')
    }
    setMobileNav(false)
    window.setTimeout(() => document.querySelector(id === 'overview' ? '.intro' : '.course-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'is-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>ml / старт</span></div>
        <div className="sidebar-label">Навигация</div>
        <nav className="main-nav">
          {navItems.map((item, index) => <button className={activeNav === item.id ? 'nav-item active' : 'nav-item'} key={item.id} onClick={() => handleNav(item.id)}><span>{index === 0 ? <LayoutGrid size={17} /> : index === 1 ? <BookOpen size={17} /> : index === 2 ? <Code2 size={17} /> : <GraduationCap size={17} />}</span>{item.label}{index === 1 && <span className="nav-count">15</span>}</button>)}
        </nav>
        <div className="sidebar-label">Текущий трек</div>
        <button className="track-card" onClick={() => handleNav('weeks')}><div className="track-icon"><Terminal size={17} /></div><div><strong>От нуля до RNN</strong><span>Семестр 01 · 15 недель</span></div><ArrowUpRight size={15} /></button>
        <div className="progress-box"><div className="progress-heading"><span>Прогресс</span><strong>{progress}%</strong></div><div className="progress-line"><span style={{ width: `${Math.max(progress, 7)}%` }} /></div><p>{completed.length ? `Пройдено недель: ${completed.length}` : 'Начните с первой недели'}</p></div>
        <div className="sidebar-footer"><span className="status-dot" /> Все материалы локально<br /><span className="muted">обновлено сегодня</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="icon-button menu-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Открыть меню">{mobileNav ? <X size={20} /> : <Menu size={20} />}</button><div className="breadcrumb"><span>Курс</span><ChevronDown size={14} /><strong>{navItems.find((item) => item.id === activeNav)?.label}</strong></div><div className="top-actions"><div className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти тему или неделю" /></div><button className="avatar" title="Профиль студента">ИС</button></div></header>
        <div className="content-wrap">
          <section className="intro"><div><span className="eyebrow"><span className="live-dot" /> Учебный портал · 2026</span><h1>Машинное обучение<br /><em>с самого начала.</em></h1><p className="intro-copy">Практический маршрут для тех, кто впервые открывает Python. Разбираемся с кодом, данными и моделями, чтобы к концу семестра собрать свою первую RNN.</p><div className="intro-actions"><button className="primary-button" onClick={() => { setSelectedId(2); setActiveTab('Теория') }}><CirclePlay size={18} /> Продолжить обучение</button><button className="text-button" onClick={() => document.querySelector('.course-section')?.scrollIntoView({ behavior: 'smooth' })}>К карте курса <ArrowUpRight size={16} /></button></div></div><div className="intro-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="visual-core"><span className="core-bracket">{'{ }'}</span><span>learn<br />by doing</span></div><div className="visual-chip chip-one">Python <Code2 size={14} /></div><div className="visual-chip chip-two">data.csv <LayoutGrid size={14} /></div><div className="visual-chip chip-three">model.fit() <Sparkles size={14} /></div></div></section>
          <section className="stat-strip"><div><strong>15</strong><span>учебных недель</span></div><div><strong>4</strong><span>больших трека</span></div><div><strong>1</strong><span>финальный проект</span></div><div className="stat-note"><Check size={16} /> Каждая неделя — работающий артефакт</div></section>
          <section className="course-section"><div className="section-heading"><div><span className="eyebrow">01 / маршрут</span><h2>Карта курса</h2></div><div className="view-toggle"><button className="selected"><LayoutGrid size={15} /> Сетка</button><button><BookOpen size={15} /> Список</button></div></div><div className="course-layout"><div className="week-list">{filteredWeeks.length ? filteredWeeks.map((week) => { const Icon = week.icon; return <button key={week.id} className={`week-card ${selectedId === week.id ? 'selected' : ''} ${week.status === 'locked' ? 'locked' : ''}`} onClick={() => setSelectedId(week.id)}><span className={`week-number ${week.tone}`}>{week.id}</span><span className="week-info"><span className="week-track">{week.track}</span><strong>{week.title}</strong><span>{week.subtitle}</span></span><span className="week-side"><Icon size={17} /><small>{week.duration}</small></span></button> }) : <div className="empty-search">Ничего не найдено. Попробуйте «Python» или «данные».</div>}</div><article className={`detail-panel ${selected.tone}`}><div className="detail-top"><div><span className="eyebrow">Неделя {selected.id} · {selected.track}</span><h3>{selected.title}</h3><p>{selected.subtitle}</p></div><span className="detail-icon"><SelectedIcon size={22} /></span></div><div className="detail-tabs">{['Теория', 'Практика', 'Код'].map((tab) => <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>{activeTab === 'Теория' && <div className="detail-content"><h4>На этой неделе</h4><div className="topic-list">{selected.theory.map((topic) => <span key={topic}><Check size={14} />{topic}</span>)}</div><div className="callout"><BookOpen size={18} /><p><strong>Главная идея</strong>{selected.id === 2 ? ' Любая задача начинается с понятного входа, последовательности шагов и проверяемого выхода.' : ' Сначала формулируем вопрос и способ проверки, затем выбираем инструмент.'}</p></div></div>}{activeTab === 'Практика' && <div className="detail-content"><h4>Задание недели</h4><p className="task-copy">{selected.task}</p><div className="artifact"><Code2 size={17} /><div><span>Артефакт</span><strong>{selected.file}</strong></div><ArrowUpRight size={16} /></div><button className="secondary-button" onClick={toggleComplete}>{completed.includes(selected.id) ? <><Check size={16} /> Неделя завершена</> : <>Отметить как выполненную <Check size={16} /></>}</button></div>}{activeTab === 'Код' && <div className="detail-content"><div className="code-heading"><span><span className="code-dot red" /><span className="code-dot yellow" /><span className="code-dot green" /></span><small>{selected.file}</small><Terminal size={15} /></div><pre><code>{selected.code}</code></pre><button className="text-button">Открыть заготовку <ArrowUpRight size={16} /></button></div>}</article></div></section>
          <section className="bottom-band"><div><span className="eyebrow">02 / принцип курса</span><h2>Не просто смотреть.<br /><em>Собирать руками.</em></h2></div><div className="principles"><div><strong>01</strong><span>Сначала маленькая программа</span></div><div><strong>02</strong><span>Потом данные и эксперимент</span></div><div><strong>03</strong><span>В конце — модель и вывод</span></div></div></section>
        </div>
      </main>
    </div>
  )
}

export default App
