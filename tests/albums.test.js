/* eslint-disable no-console */
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/sequelize');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'Physical Graffiti', year: 1975, artistId: artist.id }),
        Album.create({ name: 'Brothers in Arms', year: 1985, artistId: artist.id }),
      ]).then((documents) => {
        albums = documents;
        done();
      })
    })

    describe('GET /artists/:artistId/albums', () => {
      it('gets all albums by artist', (done) => {
        request(app)
          .get(`/artists/${artist.id}/albums`)
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
            res.body.forEach((album) => {
              const expected = albums.find((a) => a.id === album.id);
              expect(album.name).to.equal(expected.name);
              expect(album.year).to.equal(expected.year);
            });
            done();
          });
      });
      it('returns a 404 if the artist does not exist', (done) => {
        request(app)
          .get('/artists/12345/albums')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The artist could not be found.');
            done();
          });
      });
    }) 
     
    describe('PATCH /albums/:albumId', () => {
      it('updates album year by album id', (done) => {
        const album = albums[0];
        request(app)
          .patch(`/albums/${album.id}`)
          .send({ year: 2020 })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true })
            .then((updatedAlbum) => {
              expect(updatedAlbum.year).to.equal(2020);
              done();
            })
          })
      })
      it('updates album name by album id', (done) => {
        const album = albums[0];
        request(app)
          .patch(`/albums/${album.id}`)
          .send({ name: 'The slow rush' })
          .then((res) => {
            expect(res.status).to.equal(200);
            Album.findByPk(album.id, { raw: true })
            .then((updatedAlbum) => {
              expect(updatedAlbum.name).to.equal('The slow rush');
              done();
            })
          })
      })
      it('returns a 404 if the album does not exist', (done) => {
        request(app)
          .patch('/albums/1280')
          .send({ year: 2000 })
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found');
            done();
          })
      })
    })

    describe('DELETE /albums/:albumId', () => {
      it('deletes album record by id', (done) => {
        const album = albums[0];
        request(app)
          .delete(`/albums/${album.id}`)
          .then((res) => {
            expect(res.status).to.equal(204);
            Album.findByPk(album.id, { raw: true })
            .then((updatedAlbum) => {
              expect(updatedAlbum).to.equal(null);
              done();
            })
          })
      })
      it('returns a 404 if album does not exist', (done) => {
        request(app)
          .delete('/albums/1280')
          .then((res) => {
            expect(res.status).to.equal(404);
            expect(res.body.error).to.equal('The album could not be found');
            done();
          })
      })
    });
  });
});