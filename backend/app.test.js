const request = require('supertest')
const { app } = require('./express/app');

it('works', async () => {
    const response = await request(app).get('/');
    expect(response).toMatchSnapshot()
    console.log(response)
})
