// backend/controllers/pollController.js
const { Poll, PollOption, PollVote, User, Category } = require('../models');

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        { model: PollOption, as: 'PollOptions', attributes: ['id', 'text'] },
        { model: Category,     attributes: ['id','name'], },
      ],
      order: [['created_at','DESC']],
    });

    // Count votes per option & total
    const formatted = await Promise.all(polls.map(async p => {
      const opts = await Promise.all(p.PollOptions.map(async o => {
        const v = await PollVote.count({ where: { option_id: o.id } });
        return { id:String(o.id), text:o.text, votes:v };
      }));
      const total = opts.reduce((sum,o)=>sum+o.votes,0);
      return {
        id:       String(p.id),
        title:    p.question,
        description: null,
        options:  opts,
        totalVotes: total,
        createdBy: String(p.user_id),
        createdAt: p.created_at,
        endDate:  p.expires_at,
        sportId:  String(p.category_id),
        sportName: p.Category.name,
      };
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Failed to load polls' });
  }
};

exports.votePoll = async (req, res) => {
  const userId   = req.user.id;
  const { pollId, optionId } = req.body;

  try {
    // ensure poll open
    const poll = await Poll.findByPk(pollId);
    if (!poll)      return res.status(404).json({message:'No such poll'});
    if (poll.expires_at && new Date(poll.expires_at) < new Date())
      return res.status(400).json({message:'Poll closed'});

    // ensure not already voted
    const exists = await PollVote.findOne({ where:{ option_id:optionId, user_id:userId } });
    if (exists)     return res.status(400).json({message:'Already voted'});

    // record vote
    await PollVote.create({ option_id:optionId, user_id:userId });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Vote failed' });
  }
};

exports.createPoll = async (req, res) => {
  try {
    const userId     = req.user.id;
    const { question, options, categoryId, expiresAt } = req.body;

    // 1) Basic validation
    if (
      !question ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !categoryId
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // 2) Ensure the category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // 3) Create the poll
    const poll = await Poll.create({
      question,
      user_id:     userId,
      category_id: categoryId,
      expires_at:  expiresAt || null
    });

    // 4) Create each option
    await Promise.all(
      options.map((text) =>
        PollOption.create({ poll_id: poll.id, text: text.trim() })
      )
    );

    // 5) Re‑load the poll with its options (using the correct alias) and category
    const saved = await Poll.findByPk(poll.id, {
      include: [
        // **Use the same alias you set up in your model!**
        { model: PollOption, as: 'options', attributes: ['id','text'] },
        { model: Category,   attributes: ['id','name'] }
      ]
    });

    // 6) Format the JSON exactly as the front‐end expects
    const opts = saved.options.map(o => ({
      id:    String(o.id),
      text:  o.text,
      votes: 0
    }));

    return res.status(201).json({
      id:         String(saved.id),
      title:      saved.question,
      description: null,
      options:    opts,
      totalVotes: 0,
      createdBy:  String(saved.user_id),
      createdAt:  saved.created_at,
      endDate:    saved.expires_at,
      sportId:    String(saved.category_id),
      sportName:  saved.Category.name
    });
  } catch (err) {
    console.error('createPoll error:', err);
    return res.status(500).json({ message: 'Poll creation failed' });
  }
};


exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }
  
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const existing = await Category.findOne({ where: { slug } });
      if (existing) {
        return res.status(409).json({ message: 'Category already exists' });
      }
  
      const newCategory = await Category.create({ name, description, slug });
      res.status(201).json({ message: 'Category created', category: newCategory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while creating category' });
    }
  };
