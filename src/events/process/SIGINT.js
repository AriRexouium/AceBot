module.exports = async (client) => {
  try {
    await client.destroy()
    process.exit(0)
  } catch (error) {
    process.exit(0)
  }
}
