export const useColors = color => {
  switch (color) {
    case '#97D7ED':
      return {
        name: 'blue',
        default: '#97D7ED',
        dark: '#0857A6',  
      }
    case '#D6C5F7':
      return {
        name: 'purple',
        default: '#D6C5F7',
        dark: '#7249C3',  
      }
    case '#B4F8CC':
      return {
        name: 'green',
        default: '#B4F8CC',
        dark: '#4F8F45',  
      }
    case '#FFC2CB':
      return {
        name: 'pink',
        default: '#FFC2CB',
        dark: '#A53D4C',
      }
    case '#FFE5A8':
      return {
        name: 'yellow',
        default: '#FFE5A8',
        dark: '#DD8B11',
      }
    default:
      return {
        name: 'blue',
        default: '#97D7ED',
        dark: '#0857A6',  
      }
  }
}