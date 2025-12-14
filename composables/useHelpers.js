export const useHelpers = () => {
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return {
    capitalizeFirstLetter
  }
}