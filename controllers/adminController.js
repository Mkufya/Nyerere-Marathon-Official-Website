const News = require('../models/News');
const Sponsor = require('../models/Sponsor');
const Highlight = require('../models/Highlight');
const Interview = require('../models/Interview');
const Gallery = require('../models/gallery');
const Race = require('../models/Race');
const Registration = require('../models/Registration');
const User = require('../models/User');
const Result = require('../models/Result');

// Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      // Return mock data when database is not connected
      const stats = {
        overview: {
          totalUsers: 0,
          totalRaces: 0,
          totalRegistrations: 0,
          completedPayments: 0,
          pendingPayments: 0,
          totalRevenue: 0
        },
        content: {
          totalNews: 0,
          totalSponsors: 0,
          totalGallery: 0,
          totalHighlights: 0,
          totalInterviews: 0
        },
        recent: {
          registrations: [],
          news: []
        },
        trends: {
          registrations: []
        }
      };

      return res.json(stats);
    }

    const [
      totalUsers,
      totalRaces,
      totalRegistrations,
      completedPayments,
      pendingPayments,
      totalNews,
      totalSponsors,
      totalGallery,
      totalHighlights,
      totalInterviews
    ] = await Promise.all([
      User.countDocuments(),
      Race.countDocuments(),
      Registration.countDocuments(),
      Registration.countDocuments({ paymentStatus: 'completed' }),
      Registration.countDocuments({ paymentStatus: 'pending' }),
      News.countDocuments(),
      Sponsor.countDocuments(),
      Gallery.countDocuments(),
      Highlight.countDocuments(),
      Interview.countDocuments()
    ]);

    // Revenue calculation
    const revenue = await Registration.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('participant', 'firstName lastName email')
      .populate('race', 'name distance')
      .sort({ registrationDate: -1 })
      .limit(10);

    // Recent news
    const recentNews = await News.find()
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Registration trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const registrationTrends = await Registration.aggregate([
      { $match: { registrationDate: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$registrationDate" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const stats = {
      overview: {
        totalUsers,
        totalRaces,
        totalRegistrations,
        completedPayments,
        pendingPayments,
        totalRevenue: revenue.length > 0 ? revenue[0].total : 0
      },
      content: {
        totalNews,
        totalSponsors,
        totalGallery,
        totalHighlights,
        totalInterviews
      },
      recent: {
        registrations: recentRegistrations,
        news: recentNews
      },
      trends: {
        registrations: registrationTrends
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

// News Management
exports.getAllNews = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      // Return empty data when database is not connected
      return res.json({
        news: [],
        pagination: {
          current: 1,
          pages: 1,
          total: 0
        }
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const category = req.query.category;

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const [news, total] = await Promise.all([
      News.find(query)
        .populate('author', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments(query)
    ]);

    res.json({
      news,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
};

exports.createNews = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    // Create a default author ObjectId if req.user.id is not valid
    let authorId = req.user?.id;
    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      // Create a default admin user ID
      authorId = new mongoose.Types.ObjectId();
    }

    const newsData = {
      ...req.body,
      author: authorId,
      imageUrl: req.file ? `/uploads/news/${req.file.filename}` : null
    };

    const news = new News(newsData);
    await news.save();

    res.status(201).json({ message: 'News created successfully', news });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ message: 'Error creating news' });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/news/${req.file.filename}`;
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'firstName lastName');

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ message: 'Error updating news' });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ message: 'Error deleting news' });
  }
};

// Sponsor Management
exports.getAllSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ priority: -1, createdAt: -1 });
    res.json(sponsors);
  } catch (error) {
    console.error('Get sponsors error:', error);
    res.status(500).json({ message: 'Error fetching sponsors' });
  }
};

exports.createSponsor = async (req, res) => {
  try {
    const sponsorData = {
      ...req.body,
      logoUrl: req.file ? `/uploads/sponsors/${req.file.filename}` : null
    };

    const sponsor = new Sponsor(sponsorData);
    await sponsor.save();

    res.status(201).json({ message: 'Sponsor created successfully', sponsor });
  } catch (error) {
    console.error('Create sponsor error:', error);
    res.status(500).json({ message: 'Error creating sponsor' });
  }
};

exports.updateSponsor = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.logoUrl = `/uploads/sponsors/${req.file.filename}`;
    }

    const sponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    res.json({ message: 'Sponsor updated successfully', sponsor });
  } catch (error) {
    console.error('Update sponsor error:', error);
    res.status(500).json({ message: 'Error updating sponsor' });
  }
};

exports.deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }

    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error('Delete sponsor error:', error);
    res.status(500).json({ message: 'Error deleting sponsor' });
  }
};

// Gallery Management
exports.getAllGallery = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      // Return mock data when database is not connected
      const mockGallery = [
        {
          _id: '1',
          title: 'Sample Gallery Item',
          description: 'This is a sample gallery item (temporary storage)',
          imageUrl: '/uploads/gallery/sample-image.jpg',
          type: 'gallery',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: '2',
          title: 'Sample Slider Item',
          description: 'This is a sample slider item (temporary storage)',
          imageUrl: '/uploads/sliders/sample-slider.jpg',
          type: 'slider',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      return res.json({
        gallery: mockGallery,
        pagination: {
          current: 1,
          pages: 1,
          total: mockGallery.length
        }
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    let query = {};
    if (type) query.type = type;

    const [gallery, total] = await Promise.all([
      Gallery.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(query)
    ]);

    res.json({
      gallery,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Error fetching gallery' });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      // Create a mock response when database is not connected
      const mockGalleryItem = {
        _id: Date.now().toString(),
        ...req.body,
        imageUrl: req.file ? `/uploads/${req.body.type || 'gallery'}/${req.file.filename}` : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return res.status(201).json({ 
        message: 'Gallery item created successfully (temporary storage)', 
        galleryItem: mockGalleryItem 
      });
    }

    const galleryData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/${req.body.type || 'gallery'}/${req.file.filename}` : null
    };

    const galleryItem = new Gallery(galleryData);
    await galleryItem.save();

    res.status(201).json({ message: 'Gallery item created successfully', galleryItem });
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).json({ message: 'Error creating gallery item' });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.body.type || 'gallery'}/${req.file.filename}`;
    }

    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item updated successfully', galleryItem });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ message: 'Error updating gallery item' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    // Check if database is connected
    const mongoose = require('mongoose');
    const isDatabaseConnected = mongoose.connection.readyState === 1;

    if (!isDatabaseConnected) {
      return res.status(503).json({ message: 'Database not connected. Please try again later.' });
    }

    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ message: 'Error deleting gallery item' });
  }
};

// Highlight Management
exports.getAllHighlights = async (req, res) => {
  try {
    const highlights = await Highlight.find().sort({ priority: -1, createdAt: -1 });
    res.json(highlights);
  } catch (error) {
    console.error('Get highlights error:', error);
    res.status(500).json({ message: 'Error fetching highlights' });
  }
};

exports.createHighlight = async (req, res) => {
  try {
    const highlightData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/highlights/${req.file.filename}` : null,
      author: req.user.id
    };

    const highlight = new Highlight(highlightData);
    await highlight.save();

    res.status(201).json({ message: 'Highlight created successfully', highlight });
  } catch (error) {
    console.error('Create highlight error:', error);
    res.status(500).json({ message: 'Error creating highlight' });
  }
};

exports.updateHighlight = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/highlights/${req.file.filename}`;
    }

    const highlight = await Highlight.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json({ message: 'Highlight updated successfully', highlight });
  } catch (error) {
    console.error('Update highlight error:', error);
    res.status(500).json({ message: 'Error updating highlight' });
  }
};

exports.deleteHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findByIdAndDelete(req.params.id);
    if (!highlight) {
      return res.status(404).json({ message: 'Highlight not found' });
    }

    res.json({ message: 'Highlight deleted successfully' });
  } catch (error) {
    console.error('Delete highlight error:', error);
    res.status(500).json({ message: 'Error deleting highlight' });
  }
};

// Interview Management
exports.getAllInterviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [interviews, total] = await Promise.all([
      Interview.find()
        .populate('interviewer', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Interview.countDocuments()
    ]);

    res.json({
      interviews,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};

exports.createInterview = async (req, res) => {
  try {
    const interviewData = {
      ...req.body,
      imageUrl: req.file ? `/uploads/interviews/${req.file.filename}` : null,
      interviewer: req.user.id
    };

    const interview = new Interview(interviewData);
    await interview.save();

    res.status(201).json({ message: 'Interview created successfully', interview });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: 'Error creating interview' });
  }
};

exports.updateInterview = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/interviews/${req.file.filename}`;
    }

    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('interviewer', 'firstName lastName');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ message: 'Interview updated successfully', interview });
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Error updating interview' });
  }
};

exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Error deleting interview' });
  }
};

// Registration Management
exports.getRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const raceId = req.query.raceId;

    let query = {};
    if (status) query.status = status;
    if (raceId) query.race = raceId;

    const [registrations, total] = await Promise.all([
      Registration.find(query)
        .populate('participant', 'firstName lastName email phone')
        .populate('race', 'name distance category')
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(limit),
      Registration.countDocuments(query)
    ]);

    res.json({
      registrations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Error fetching registrations' });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status, notes, updatedAt: new Date() },
      { new: true }
    ).populate('participant', 'firstName lastName email')
     .populate('race', 'name distance');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Registration status updated successfully', registration });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ message: 'Error updating registration' });
  }
};

// Results Management
exports.getResults = async (req, res) => {
  try {
    const raceId = req.query.raceId;
    let query = {};
    if (raceId) query.race = raceId;

    const results = await Result.find(query)
      .populate('participant', 'firstName lastName')
      .populate('race', 'name distance')
      .sort({ finishTime: 1 });

    res.json(results);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Error fetching results' });
  }
};

exports.uploadResults = async (req, res) => {
  try {
    const { raceId, results } = req.body;

    // Validate race exists
    const race = await Race.findById(raceId);
    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }

    // Process results
    const resultPromises = results.map(async (result) => {
      const existingResult = await Result.findOne({
        race: raceId,
        participant: result.participantId
      });

      if (existingResult) {
        return Result.findByIdAndUpdate(existingResult._id, {
          finishTime: result.finishTime,
          position: result.position,
          category: result.category,
          updatedAt: new Date()
        }, { new: true });
      } else {
        const newResult = new Result({
          race: raceId,
          participant: result.participantId,
          finishTime: result.finishTime,
          position: result.position,
          category: result.category
        });
        return newResult.save();
      }
    });

    await Promise.all(resultPromises);

    res.json({ message: 'Results uploaded successfully' });
  } catch (error) {
    console.error('Upload results error:', error);
    res.status(500).json({ message: 'Error uploading results' });
  }
};
