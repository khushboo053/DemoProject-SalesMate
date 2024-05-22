exports.get404 = async (req, res) => {
    // res.status(404).send("404", { path: '/404' })
    res.status(404).send('Page Not Found')
}