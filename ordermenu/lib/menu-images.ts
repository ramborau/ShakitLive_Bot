// Menu item image mappings
export const menuImages: Record<string, string> = {
  // Pizzas
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
  'hawaiian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  'pepperoni': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
  'manager': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',

  // Drinks
  'coke': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
  'sprite': 'https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=300&fit=crop',
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
  'juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',

  // Desserts
  'dessert': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
  'smores': 'https://images.unsplash.com/photo-1588195538326-c5b1e5b80a1b?w=400&h=300&fit=crop',

  // Default fallback
  'default': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
}

export function getMenuImage(itemName: string): string {
  const name = itemName.toLowerCase()

  if (name.includes('hawaiian')) return menuImages.hawaiian
  if (name.includes('pepperoni')) return menuImages.pepperoni
  if (name.includes('manager')) return menuImages.manager
  if (name.includes('pizza')) return menuImages.pizza

  if (name.includes('coke')) return menuImages.coke
  if (name.includes('sprite') || name.includes('royal')) return menuImages.sprite
  if (name.includes('water')) return menuImages.water
  if (name.includes('tea')) return menuImages.tea
  if (name.includes('juice')) return menuImages.juice

  if (name.includes("s'more") || name.includes('choc')) return menuImages.smores
  if (name.includes('dessert')) return menuImages.dessert

  // Category-based fallback
  return menuImages.default
}
