const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  try {
    res.render("dashboard/albums", {
      albums: await AlbumModel.find().populate("artist label"),
    });
  } catch (err) {
    next(err);
  }
});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();
  res.render("dashboard/albumCreate", { artists, labels });
});

// GET - update one album (form)

router.get('/update/:id', (req, res, next) => {
  const {id} = req.params;
  AlbumModel.findById(id)
    .then((album) => res.render('albumUpdate.hbs', album))
    .catch((error) => {next(error)});
    
});

// GET - delete one album

// POST - create one album
router.post("/", uploader.single("cover"), async (req, res, next) => {
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - update one album

router.post('/:id', async (req, res, next) => {
try {
  const {id} = req.params;
  const {title, releaseDate, label, artist, cover} = req.body;
  const updatedAlbum = await AlbumModel.findByIdAndUpdate(id, req.body,{new:true})
    res.redirect(`/${updatedAlbum}`)
}
catch(error) {
  next(error)
}
})

module.exports = router;
