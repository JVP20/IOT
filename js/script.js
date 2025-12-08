// Sistema de Monitoramento Ambiental
// JavaScript para controle dinâmico dos dados

class EnvironmentalMonitor {
    constructor() {
        this.data = {
            temperature: 19.5,
            humidity: 85,
            smoke: 0
        };
        
        this.historicalData = [];
        this.charts = {};
        this.updateInterval = null;
        this.lastUpdate = new Date();
        
        // Configuração do tema
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        this.init();
    }

    async init() {
    
    // 🔥 1. Chama a API imediatamente ao iniciar
    try {
        const response = await fetch("https://iot.brunoparente22.workers.dev/api/data", {
            method: "GET",
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Falha ao acessar API. Status: " + response.status);
        }

        const json = await response.json();

        if (!json || json.temperature === undefined) {
            console.warn("API retornou um formato inesperado:", json);
            return;
        }

        // Atualiza os dados antes de qualquer renderização
        this.data = {
            temperature: Number(json.temperature),
            humidity: Number(json.humidity),
            smoke: Number(json.smoke)
        };

        this.lastUpdate = new Date();

    } catch (err) {
        console.error("Erro ao buscar dados iniciais da API:", err);
    }

    // 🔥 2. Só depois disso, o resto roda normalmente:
    this.setupTheme();
    this.loadHistoricalData();
    this.initializeCharts();
    this.startRealTimeUpdates();
    this.bindEvents();
    this.updateDisplay();
}


    // Configurar tema
    setupTheme() {
        console.log('Configurando tema. Dark mode inicial:', this.isDarkMode);
        if (this.isDarkMode) {
            document.body.classList.add('dark');
            this.updateThemeIcon(true);
            console.log('Tema dark aplicado');
        } else {
            console.log('Tema claro aplicado');
        }
    }

    // Alternar entre modo claro e escuro
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', this.isDarkMode);
        this.updateThemeIcon(this.isDarkMode);
        console.log('Tema alterado:', this.isDarkMode ? 'dark' : 'light');
    }

    // Atualizar ícone do tema
    updateThemeIcon(isDark) {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        if (isDark) {
            icon.className = 'fas fa-sun text-xl';
            themeToggle.title = 'Alternar para modo claro';
        } else {
            icon.className = 'fas fa-moon text-xl';
            themeToggle.title = 'Alternar para modo escuro';
        }
    }

    // Definir classe de cor dinâmica baseada em temperatura
    getTemperatureClass(temperature) {
        const temp = parseFloat(temperature);
        if (temp < 18) return 'cold';
        if (temp >= 18 && temp <= 25) return 'normal';
        if (temp > 25 && temp <= 30) return 'warm';
        return 'hot';
    }

    // Definir classe de cor dinâmica baseada em umidade
    getHumidityClass(humidity) {
        if (humidity < 40) return 'low';
        if (humidity >= 40 && humidity <= 70) return 'normal';
        return 'high';
    }

    /*// Gerar dados aleatórios para simulação
    generateRandomData() {
        const lastTemp = parseFloat(this.data.temperature);
        const lastHumidity = this.data.humidity;
        
        // Gerar variações suaves e realistas
        const tempVariation = (Math.random() - 0.5) * 4; // Variação de ±2°C
        const humidityVariation = (Math.random() - 0.5) * 20; // Variação de ±10%
        
        let newTemp = lastTemp + tempVariation;
        let newHumidity = lastHumidity + humidityVariation;
        
        // Manter dentro dos limites
        newTemp = Math.max(10, Math.min(40, newTemp));
        newHumidity = Math.max(20, Math.min(90, newHumidity));
        
        return {
            temperature: newTemp.toFixed(1),
            humidity: Math.floor(newHumidity),
            smoke: Math.floor(Math.random() * 100)
        };
    }*/

    async fetchDataFromAPI() {
        try {
            const response = await fetch("https://iot.brunoparente22.workers.dev/api/data", {
                method: "GET",
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Falha ao acessar API. Status: " + response.status);
            }

            const json = await response.json();

            // Validação básica do formato retornado
            if (!json || json.temperature === undefined) {
                console.warn("API retornou um formato inesperado:", json);
                return;
            }

            this.data = {
                temperature: Number(json.temperature),
                humidity: Number(json.humidity),
                smoke: Number(json.smoke)
            };

            
            // Registrar o primeiro valor da API no histórico
            this.historicalData.push({
                timestamp: new Date(),
                ...this.data
            });

            // Limitar tamanho
            if (this.historicalData.length > 100) {
                this.historicalData.shift();
            }

            this.saveHistoricalData();

            console.log("API atualizada:", this.data);

        } catch (err) {
            console.error("Erro ao buscar dados da API:", err);
        }
    }



    // Atualizar display dos cards com cores dinâmicas
    updateDisplay() {
        const tempElement = document.getElementById('temperature');
        const humidityElement = document.getElementById('humidity');
        const smokeElement = document.getElementById('smoke');
        
        tempElement.textContent = `${this.data.temperature}°C`;
        humidityElement.textContent = `${this.data.humidity}%`;
        smokeElement.textContent = `${this.data.smoke} ppm`;
        
        // Aplicar cores dinâmicas
        this.applyDynamicColors();
        this.updateStatusIndicators();
        this.updateLastUpdateTime();
    }

    // Aplicar cores dinâmicas apenas aos indicadores
    applyDynamicColors() {
        const tempCard = document.querySelector('.temperature-card');
        const humidityCard = document.querySelector('.humidity-card');
        
        // Obter classes de cor baseadas nos valores
        const tempClass = this.getTemperatureClass(this.data.temperature);
        const humidityClass = this.getHumidityClass(this.data.humidity);
        
        // Aplicar classes de indicador apenas aos cards
        const isDarkMode = document.body.classList.contains('dark');
        const baseClasses = isDarkMode 
            ? 'rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200'
            : 'bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all duration-200';
            
        tempCard.className = `${baseClasses} temperature-card indicator-${tempClass}`;
        humidityCard.className = `${baseClasses} humidity-card indicator-${humidityClass}`;
        
        
        // Atualizar textos de status
        const tempStatusText = document.getElementById('temp-status');
        const humidityStatusText = document.getElementById('humidity-status');
        
        if (tempStatusText) {
            tempStatusText.textContent = this.getTemperatureStatusText(tempClass);
        }
        if (humidityStatusText) {
            humidityStatusText.textContent = this.getHumidityStatusText(humidityClass);
        }
    }
    
    // Obter texto de status da temperatura
    getTemperatureStatusText(tempClass) {
        switch(tempClass) {
            case 'cold': return 'Fria';
            case 'normal': return 'Normal';
            case 'warm': return 'Quente';
            case 'hot': return 'Muito Quente';
            default: return 'Normal';
        }
    }
    
    // Obter texto de status da umidade
    getHumidityStatusText(humidityClass) {
        switch(humidityClass) {
            case 'low': return 'Seca';
            case 'normal': return 'Ideal';
            case 'high': return 'Alta';
            default: return 'Ideal';
        }
    }

    // Atualizar indicadores de status
    updateStatusIndicators() {
        const temp = parseFloat(this.data.temperature);
        const humidity = this.data.humidity;
        const smoke = this.data.smoke;

        // Status da temperatura
        const tempElement = document.getElementById('temperature').parentElement.parentElement.querySelector('.text-sm');
        if (temp < 18) {
            tempElement.textContent = 'Fria';
            tempElement.className = 'text-sm text-blue-600 dark:text-blue-400 mt-1';
        } else if (temp > 30) {
            tempElement.textContent = 'Quente';
            tempElement.className = 'text-sm text-red-600 dark:text-red-400 mt-1';
        } else {
            tempElement.textContent = 'Normal';
            tempElement.className = 'text-sm text-gray-500 dark:text-gray-400 mt-1';
        }

        // Status da umidade
        const humidityElement = document.getElementById('humidity').parentElement.parentElement.querySelector('.text-sm');
        if (humidity < 30) {
            humidityElement.textContent = 'Seca';
            humidityElement.className = 'text-sm text-yellow-600 dark:text-yellow-400 mt-1';
        } else if (humidity > 70) {
            humidityElement.textContent = 'Alta';
            humidityElement.className = 'text-sm text-blue-600 dark:text-blue-400 mt-1';
        } else {
            humidityElement.textContent = 'Ideal';
            humidityElement.className = 'text-sm text-gray-500 dark:text-gray-400 mt-1';
        }

        // Status da fumaça
        const smokeElement = document.getElementById('smoke').parentElement.parentElement.querySelector('.text-sm');
        if (smoke > 50) {
            smokeElement.textContent = 'Alta concentração';
            smokeElement.className = 'text-sm text-red-600 dark:text-red-400 mt-1';
        } else if (smoke > 20) {
            smokeElement.textContent = 'Moderada';
            smokeElement.className = 'text-sm text-yellow-600 dark:text-yellow-400 mt-1';
        } else {
            smokeElement.textContent = 'Sem detecção';
            smokeElement.className = 'text-sm text-green-600 dark:text-green-400 mt-1';
        }
    }

    // Inicializar gráficos
    initializeCharts() {
        this.createLineChart();
        this.createBarChart();
    }

    // Criar gráfico de linhas
    createLineChart() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        
        // Gerar dados iniciais
        const labels = [];
        const tempData = [];
        const humidityData = [];
        const smokeData = [];
        
        for (let i = 19; i >= 0; i--) {
            const time = new Date(Date.now() - i * 60000); // Últimos 20 minutos
            labels.push(time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            
            if (this.historicalData.length > i) {
                // Se houver dado real, usa ele
                const data = this.historicalData[this.historicalData.length - 1 - i];
                tempData.push(parseFloat(data.temperature));
                humidityData.push(data.humidity);
                smokeData.push(data.smoke);
            } else {
                // ❌ Sem dados reais disponíveis → deixa vazio
                tempData.push(null);
                humidityData.push(null);
                smokeData.push(null);
            }
        }

        this.charts.lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: tempData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Umidade (%)',
                    data: humidityData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Fumaça (ppm)',
                    data: smokeData,
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: document.documentElement.classList.contains('dark') ? '#cbd5e1' : '#6b7280'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 3,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Criar gráfico de barras
    createBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        
        this.charts.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Temperatura', 'Umidade', 'Fumaça'],
                datasets: [{
                    label: 'Valor Atual',
                    data: [
                        parseFloat(this.data.temperature),
                        this.data.humidity,
                        this.data.smoke
                    ],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                    ],
                    borderColor: [
                        '#ef4444',
                        '#3b82f6',
                        '#6b7280'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Atualizar gráficos
    updateCharts() {
        console.log('Atualizando gráficos...');
        try {
            if (this.charts.lineChart && this.charts.lineChart.data) {
                const now = new Date();
                const timeLabel = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                // Adicionar novo ponto
                this.charts.lineChart.data.labels.push(timeLabel);
                this.charts.lineChart.data.datasets[0].data.push(parseFloat(this.data.temperature));
                this.charts.lineChart.data.datasets[1].data.push(this.data.humidity);
                this.charts.lineChart.data.datasets[2].data.push(this.data.smoke);
                
                // Manter apenas os últimos 20 pontos
                if (this.charts.lineChart.data.labels.length > 20) {
                    this.charts.lineChart.data.labels.shift();
                    this.charts.lineChart.data.datasets.forEach(dataset => {
                        dataset.data.shift();
                    });
                }
                
                this.charts.lineChart.update('none');
                console.log('Gráfico de linhas atualizado');
            } else {
                console.log('Gráfico de linhas não disponível');
            }
            
            if (this.charts.barChart && this.charts.barChart.data) {
                this.charts.barChart.data.datasets[0].data = [
                    parseFloat(this.data.temperature),
                    this.data.humidity,
                    this.data.smoke
                ];
                this.charts.barChart.update('none');
                console.log('Gráfico de barras atualizado');
            } else {
                console.log('Gráfico de barras não disponível');
            }
        } catch (error) {
            console.warn('Erro ao atualizar gráficos:', error);
        }
    }

    // Carregar dados históricos
    loadHistoricalData() {
        const saved = localStorage.getItem("monitor_historical_data");

        if (saved) {
            // histórico real salvo no navegador
            this.historicalData = JSON.parse(saved);
        } else {
            // se não existir ainda, começa vazio
            this.historicalData = [];
        }
    }

    saveHistoricalData() {
        localStorage.setItem(
            "monitor_historical_data",
            JSON.stringify(this.historicalData)
        );
    }



    // Atualizar tabela
    updateTable() {
        try {
            const tbody = document.getElementById('tableBody');
            if (!tbody) return;

            tbody.innerHTML = '';

            const recentData = this.historicalData.slice(-10);

            recentData.forEach(record => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-150';

                const status = this.getStatus(record);

                row.innerHTML = `
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-900 font-medium metric-value-color">
                        ${new Date(record.timestamp).toLocaleTimeString('pt-BR')}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-900 font-medium metric-value-color">
                        ${record.temperature}°C
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-900 font-medium metric-value-color">
                        ${record.humidity}%
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-900 font-medium metric-value-color">
                        ${record.smoke} ppm
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}">
                            ${status.text}
                        </span>
                    </td>
                `;
                
                tbody.appendChild(row);
            });
        } catch (error) {
            console.warn('Erro ao atualizar tabela:', error);
        }
    }



    // Obter status baseado nos valores
    getStatus(record) {
        const temp = parseFloat(record.temperature);
        const humidity = record.humidity;
        const smoke = record.smoke;
        
        if (temp > 30 || temp < 18 || smoke > 50) {
            return { text: 'Crítico', class: 'bg-red-100 text-red-800' };
        } else if (temp > 28 || humidity > 70 || smoke > 20) {
            return { text: 'Atenção', class: 'bg-yellow-100 text-yellow-800' };
        } else {
            return { text: 'Normal', class: 'bg-green-100 text-green-800' };
        }
    }

    // Atualizar tempo desde a última atualização
    updateLastUpdateTime() {
        const el = document.getElementById("last-Update");
        if (!el) return;

        el.textContent = `Última atualização: ${this.lastUpdate.toLocaleTimeString("pt-BR")}`;
    }





    /*// Iniciar atualizações em tempo real
    startRealTimeUpdates() {
        console.log('Iniciando atualizações em tempo real...');
        this.updateInterval = setInterval(() => {
            const newData = this.generateRandomData();
            this.data = newData;
            this.lastUpdate = new Date();
            
            // Adicionar aos dados históricos
            this.historicalData.push({
                timestamp: new Date(),
                ...newData
            });
            
            // Manter apenas os últimos 100 registros
            if (this.historicalData.length > 100) {
                this.historicalData.shift();
            }
            
            this.updateDisplay();
            this.updateCharts();
            this.updateTable();
        }, 15000); // Atualizar a cada 5 segundos
        
        console.log('Atualizações iniciadas com intervalo de 5 segundos');
    }*/
   // Iniciar atualizações em tempo real com API real
    startRealTimeUpdates() {
        console.log('Iniciando atualizações em tempo real...');
        
        this.updateInterval = setInterval(async () => {
            try {
                const response = await fetch("https://iot.brunoparente22.workers.dev/api/data", {
                    cache: "no-store"
                });

                if (!response.ok) {
                    throw new Error("Erro ao consultar API: " + response.status);
                }

                const json = await response.json();

                // Atualizar os dados principais
                this.data = {
                    temperature: json.temperature,
                    humidity: json.humidity,
                    smoke: json.smoke
                };

                this.lastUpdate = new Date();

                // Adicionar aos dados históricos
                this.historicalData.push({
                    timestamp: new Date(),
                    ...this.data
                });

                // Manter apenas os últimos 100 registros
                if (this.historicalData.length > 100) {
                    this.historicalData.shift();
                }

                this.saveHistoricalData();

                // Atualizar visual
                this.updateDisplay();
                this.updateCharts();
                this.updateTable();

            } catch (error) {
                console.error("Erro ao obter dados da API:", error);
            }
        }, 500000); // Atualiza a cada 15 segundos

        console.log('Atualizações iniciadas com intervalo de 15 segundos');
    }

    startRealTimeUpdates2() {
        console.log('Atualizando dados...');

        fetch("https://iot.brunoparente22.workers.dev/api/data", { cache: "no-store" })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao consultar API: " + response.status);
                }
                return response.json();
            })
            .then(json => {
                // Atualizar os dados principais
                this.data = {
                    temperature: json.temperature,
                    humidity: json.humidity,
                    smoke: json.smoke
                };

                this.lastUpdate = new Date();

                // Adicionar aos dados históricos
                this.historicalData.push({
                    timestamp: new Date(),
                    ...this.data
                });

                // Manter apenas os últimos 100 registros
                if (this.historicalData.length > 100) {
                    this.historicalData.shift();
                }

                this.saveHistoricalData();

                // Atualizar visual
                this.updateDisplay();
                this.updateCharts();
                this.updateTable();

                console.log('Atualização concluída');
            })
            .catch(error => {
                console.error("Erro ao obter dados da API:", error);
            });
    }



    // Vincular eventos
    bindEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.manualRefresh();
        });
        
        // Evento do botão de tema
        document.getElementById('themeToggle').addEventListener('click', () => {
            console.log('Botão de tema clicado');
            this.toggleTheme();
        });
    }

    // Atualização manual
    manualRefresh() {
        const btn = document.getElementById('refreshBtn');
        const originalHTML = btn.innerHTML;
        
        btn.classList.add('loading');
        btn.innerHTML = '<i class="fas fa-spinner mr-2"></i>Atualizando...';
        
        // Simular atualização
        setTimeout(() => {
            const newData = this.startRealTimeUpdates2();
            this.data = newData;
            this.lastUpdate = new Date();
            
            btn.classList.remove('loading');
            btn.innerHTML = originalHTML;
        }, 1000);
    }

    // Método para definir valores manualmente (útil para integração com sensores reais)
    setValues(temperature, humidity, smoke) {
        this.data = {
            temperature: temperature,
            humidity: humidity,
            smoke: smoke
        };
        this.lastUpdate = new Date();
        this.updateDisplay();
        this.updateCharts();
    }

    // Destruir monitor
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
    }
}

// Inicializar o monitoramento quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.monitor = new EnvironmentalMonitor();
});

// Função utilitária para integração com APIs reais
async function fetchSensorData(apiEndpoint) {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        
        if (window.monitor) {
            window.monitor.setValues(
                data.temperature || data.temp,
                data.humidity,
                data.smoke || data.ppm || 0
            );
        }
    } catch (error) {
        console.error('Erro ao buscar dados do sensor:', error);
    }
}

// Exemplo de uso com API:
// fetchSensorData('https://sua-api.com/sensor-data');
// setInterval(() => fetchSensorData('https://sua-api.com/sensor-data'), 5000);