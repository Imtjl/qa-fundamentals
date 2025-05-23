import org.junit.jupiter.api.Assertions.*

class FastPicMainPageTest : BaseBrowserTest() {
    override fun runTest() {
        var title = driver.title
        assertTrue(
            title.contains("FastPic"),
            "Page title should contain 'FastPic'",
        )

        val fileInput = findByXPath("//input[@type='file']")
        assertTrue(
            fileInput.isDisplayed(),
            "File element should always be visible",
        )
    }
}
