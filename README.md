# Monitoramento Ambiental - Site Single Page

## 📋 Descrição do Projeto

Site single page moderno para monitoramento de dados ambientais em tempo real, exibindo informações de temperatura, umidade e fumaça com cards interativos, gráficos dinâmicos e tabela de dados históricos. O site agora inclui **modo dark** e **cores dinâmicas** que mudam com base nos valores de temperatura e umidade!

## 🚀 Funcionalidades Implementadas

### ✅ Cards de Monitoramento
- **Card de Temperatura**: Exibe temperatura atual com indicação visual de status (Normal/Fria/Quente)
- **Card de Umidade**: Mostra nível de umidade com status (Seca/Ideal/Alta)
- **Card de Fumaça**: Exibe nível de fumaça com detecção (Sem detecção/Moderada/Alta concentração)

### ✅ Modo Dark
- **Toggle de alternância**: Botão no canto superior direito do header
- **Persistência**: A preferência é salva no localStorage
- **Transições suaves**: Mudanças suaves entre temas
- **Ícones dinâmicos**: Lua/sol muda conforme o tema

### ✅ Cores Dinâmicas Baseadas em Temperatura
- **Frio (< 18°C)**: Cards azuis, texto azul gradiente
- **Normal (18-25°C)**: Cards verdes, texto verde gradiente  
- **Quente (25-30°C)**: Cards amarelos, texto laranja gradiente
- **Muito quente (> 30°C)**: Cards vermelhos, texto vermelho gradiente

### ✅ Cores Dinâmicas Baseadas em Umidade
- **Baixa (< 40%)**: Cards amarelos, texto laranja gradiente
- **Normal (40-70%)**: Cards verdes, texto verde gradiente
- **Alta (> 70%)**: Cards azuis, texto azul gradiente

### ✅ Gráficos Interativos
- **Gráfico de Linhas**: Tendência temporal das três métricas nos últimos 20 minutos
- **Gráfico de Barras**: Comparação visual dos valores atuais
- **Atualização em tempo real**: Gráficos atualizam automaticamente a cada 5 segundos

### ✅ Tabela de Dados Históricos
- **Registros recentes**: Exibe os 10 últimos registros
- **Status colorido**: Indicação visual do status (Normal/Atenção/Crítico)
- **Horários**: Registro com timestamp preciso

### ✅ Interface Responsiva
- **Design moderno**: Usando Tailwind CSS para estilização
- **Responsivo**: Adapta-se a dispositivos móveis e desktop
- **Animações suaves**: Transições e efeitos visuais
- **Ícones**: Font Awesome para melhor visualização

## 📁 Estrutura de Arquivos

```
/
├── index.html          # Página principal
├── css/
│   └── style.css      # Estilos personalizados
└── js/
    └── script.js      # Lógica JavaScript
```

## 🎯 Como Usar

### Instalação Local
1. Baixe todos os arquivos
2. Abra `index.html` no navegador
3. O site funcionará imediatamente com dados simulados

### Integração com Sensores Reais
Para conectar com sensores reais, use a função `fetchSensorData()`:

```javascript
// Exemplo de uso com API
fetchSensorData('https://sua-api.com/sensor-data');

// Atualizar automaticamente a cada 5 segundos
setInterval(() => fetchSensorData('https://sua-api.com/sensor-data'), 5000);
```

A função espera um JSON no formato:
```json
{
    "temperature": 25.5,
    "humidity": 65,
    "smoke": 10
}
```

## 🔧 Personalização

### Cores e Estilos
Edite `css/style.css` para personalizar:
- Cores principais: `--primary-color`, `--secondary-color`, `--danger-color`
- Sombras e efeitos: `--card-shadow`
- Animações e transições

### Intervalo de Atualização
No arquivo `js/script.js`, modifique:
```javascript
this.updateInterval = setInterval(() => {
    // código de atualização
}, 5000); // 5000ms = 5 segundos
```

### Limites de Status
Ajuste os limites de status no método `updateStatusIndicators()`:
```javascript
// Exemplo: Mudar limite de temperatura "quente"
if (temp > 30) { // Alterar para outro valor }
```

## 📊 Formatos de Dados

### Unidades Padrão
- **Temperatura**: Celsius (°C)
- **Umidade**: Porcentagem (%)
- **Fumaça**: Partes por milhão (ppm)

### Escala de Status
- **Temperatura**: 
  - Fria: < 18°C
  - Normal: 18-30°C
  - Quente: > 30°C
- **Umidade**:
  - Seca: < 30%
  - Ideal: 30-70%
  - Alta: > 70%
- **Fumaça**:
  - Sem detecção: 0-20 ppm
  - Moderada: 20-50 ppm
  - Alta concentração: > 50 ppm

## 🌐 Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões recentes)
- **Dispositivos**: Desktop, tablet, smartphone
- **Resoluções**: 320px até 4K

## 📈 Próximos Passos Recomendados

1. **Integração com Backend**: Conectar a APIs REST reais
2. **Armazenamento Persistente**: Implementar banco de dados
3. **Alertas**: Adicionar notificações para valores críticos
4. **Exportação**: Funcionalidade para exportar dados em CSV/PDF
5. **Configurações**: Painel para ajustar limites e preferências
6. **Temas**: Adicionar modo escuro/claro
7. **Múltiplos Sensores**: Suporte para monitorar vários locais
8. **Dashboard**: Visão geral com mais métricas e estatísticas

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com Tailwind CSS
- **JavaScript ES6**: Lógica dinâmica
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones vetoriais
- **Tailwind CSS**: Framework CSS utilitário

## 📄 Licença

Este projeto está disponível para uso e modificação livre.