const Event = require('../models/Event');

// Get all events (sorted by date)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name')
      .populate('registeredUsers', 'name')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user.id
    };
    
    const event = new Event(eventData);
    await event.save();
    
    await event.populate('organizer', 'name');
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Register for event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }
    
    event.registeredUsers.push(req.user.id);
    await event.save();
    
    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
