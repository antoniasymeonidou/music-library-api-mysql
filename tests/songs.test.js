/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album, Song } = require('../src/sequelize');

describe('/songs', () => {
  let artist;
  let album;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
      await Song.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      await Song.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
      album = await Album.create({
        name: 'InnerSpeaker',
        year: 2010,
        artistId: artist.id,
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /album/:albumId/song', () => {
    it('creates a new song under an album', (done) => {
      request(app)
        .post(`/albums/${album.id}/song`)
        .send({
          artist: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(201);
          const songId = res.body.id;
          expect(res.body.id).to.equal(songId);
          expect(res.body.name).to.equal('Solitude Is Bliss');
          expect(res.body.artistId).to.equal(artist.id);
          expect(res.body.albumId).to.equal(album.id);
          done();
        });
    });
  });
  it('returns a 404 and does not create a song if the album does not exist', (done) => {
    request(app)
      .post('/albums/1234/song')
      .send({
        artist: artist.id,
        name: 'Solitude Is Bliss',
      })
      .then((res) => {
        expect(res.status).to.equal(404);
        expect(res.body.error).to.equal('The album could not be found.');

        Song.findAll().then((songs) => {
          expect(songs.length).to.equal(0);
          done();
        });
      });
  });
  describe('with albums in the database', () => {
    let songs;
    beforeEach((done) => {
      Promise.all([
        Song.create({ name: 'Ten years gone', artistId: artist.id, albumId: album.id }),
        Song.create({ name: 'Walk of life', artistId: artist.id, albumId: album.id })
      ]).then((documents) => {
        songs = documents;
        done();
      })
    })

    describe('GET /albums/:albumId/songs', () => {
      it('gets all songs by album', (done) => {
        request(app)
          .get(`/albums/${album.id}/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
            });
            done();
          })
      })
      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .get('/albums/12345/songs')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          })
      })
    })

    describe('GET /artists/:artistId/songs', () => {
      it('gets all songs by artist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/songs`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
            res.body.forEach((song) => {
              const expected = songs.find((a) => a.id === song.id);
              expect(song.name).to.equal(expected.name);
            });
            done();
          })
      })
      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get('/artists/123/songs')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          })
      })
    })

    describe('PATCH /albums/:albumId/songs',() => {
      it('updates song name by album id', (done) => {
        const song = songs[0];
        request(app)
          .patch(`/albums/${album.id}/song`)
          .send({ name: 'Tangerine' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Song.findByPk(song.id, { raw: true })
             .then((updatedSong) => {
               expect(updatedSong.name).to.equal('Tangerine');
               done();
             })
          })
      })
      it('returns a 404 if the album does not exist', (done) => {
        request(app)
         .patch('/albums/12345/song')
         .send({ name: 'Tangerine' })
         .then((res) => {
           expect(res.status).to.equal(404);
           expect(res.body.error).to.equal('The album could not be found.');
           done();
         })
      })
    })

    describe('PATCH /songs/:songId', () => {
      it('updates song name by id', (done) => {
        const song = songs[0];
        request(app)
         .patch(`/songs/${song.id}`)
         .send({ name: 'Tangerine' })
         .then((res) => {
          expect(res.status).to.equal(200)
          Song.findByPk(song.id, { raw: true })
           .then((updatedSong) => {
             expect(updatedSong.name).to.equal('Tangerine');
             done();
           })  
         })
      })
      it('returns a 404 if the song does not exist', (done) => {
        request(app)
        .patch('/songs/12345')
        .send({ name: 'Tangerine' })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The song could not be found.');
          done();
        })
      })
    })


    describe('DELETE /songs/:songId', () => {
      it('deletes song record by id', (done) => {
        const song = songs[0];
        request(app)
         .delete(`/songs/${song.id}`)
         .then((res) => {
           expect(res.status).to.equal(204)
           Song.findByPk(song.id, { raw: true })
            .then((updatedSong) => {
              expect(updatedSong).to.equal(null);
              done();
            })  
         })
      })
      it('returns a 404 if song does not exist', (done) => {
        request(app)
        .delete('/songs/12345')
        .then((res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error).to.equal('The song could not be found.')
          done();
        })
      })
    })

    describe('DELETE /albums/:albumId/songs', () => {
      it('deletes song record by album id', (done) => {
        const song = songs[0];
        request(app)
         .delete(`/albums/${album.id}/song`)
         .then((res) => {
           expect(res.status).to.equal(204)
           Song.findByPk(song.id, { raw: true })
            .then((updatedSong) => {
              expect(updatedSong).to.equal(null);
              done();
            })  
         })
      })
      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .delete('/albums/12345/song')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found.');
            done();
          })
      })
    })
  })
});