export interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  category: string
}

export interface PizzaCustomization {
  crust: 'Thin' | 'Hand Tossed'
  size: 'Regular' | 'Large' | 'Party'
  toppings: string[]
}

export interface GroupMealSelection {
  pizza?: { item: MenuItem; customization: PizzaCustomization }
  pastaOrChicken?: MenuItem
  drinks?: MenuItem
}

export interface OrderItem {
  item: MenuItem
  quantity: number
  customization?: PizzaCustomization
  groupMealSelections?: GroupMealSelection
}

export interface OrderData {
  items: OrderItem[]
  name: string
  phone: string
  address: string
  notes: string
}
