const Post = require('../models/post');


exports.createPost = (req, res, next) => {
    const imagePath = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    const newPost = new Post({ title: req.body.title, content: req.body.content, imagePath: imagePath, creator: req.userData.userId});
    newPost.save()
        .then( createdPost => {
            res.json({ message: 'post created', post: createdPost})


        })
        .catch( err => {
            res.status(500).json({message: 'Create post failed'})
        })
}

exports.getPosts = (req, res, next) => {
    const pageSize = req.query.pageSize;
    const currentPage = req.query.page;
    let fetchedPost;
    let postQuery = Post.find();
    if(pageSize && currentPage) {
        // for big database is not performative and should be found another method
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize)
    }
    postQuery
        .then( posts => {
            fetchedPost = posts
            return Post.count()
        })
        .then( postsCount => {
            
            res.json({ message: 'posts fetched successfully', postsData: { posts: fetchedPost, postsCount: postsCount } })
        })
        .catch( err => {
            res.status(500).json({message: 'Fetch posts failed'})
        })
}

exports.findPost = (req, res, next) => {
    Post.findById(req.params.postId)
        .then( post => {
            res.json({ message: 'post fetched successfully', post: post })
        })
        .catch( err => {
            res.status(500).json({message: 'Fetch post failed'})
        })
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.postId, creator: req.userData.userId })
        .then( result => {
                if(result.deletedCount > 0) {
                    res.json({ message: 'post deleted', postId: req.params.postId })

                } else {
                    res.status(401).json({ message: 'Unauthorized' })
                }
            })
            .catch( err => {
                res.status(500).json({message: 'Delete post failed'})
            })
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        imagePath = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    }
    const post = new Post({
        _id: req.params.postId,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    })
    Post.updateOne({_id: req.params.postId, creator: req.userData.userId}, post)
        .then( result => {
            if(result.matchedCount > 0){
                res.json({ message: 'post updated', post: post })

            } else {
                res.status(401).json({ message: 'Unauthorized' })
            }
        })
        .catch( err => {
            res.status(500).json({message: 'Edit post failed'})
        })
}
