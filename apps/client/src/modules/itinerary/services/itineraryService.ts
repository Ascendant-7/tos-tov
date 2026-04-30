export const getItinerary = async () => {
  return {
    days: [
      {
        id: 'day1',
        day_number: 1,
        items: [
          {
            id: 'item1',
            destination: { name: 'Angkor Wat' },
            time: '09:00',
            category: 'attraction', 
            duration: '2',
            price: '6',
            notes: '',
            position: 1
          },
          {
          id: 'item2',
          destination: { name: 'Phum Preas dak' },
          time: '09:00',
          category: 'food', 
          duration: '1',
          price: '8-15',
          notes: '',
          position: 1
        }
        ]
      }
    ]
  }
}
