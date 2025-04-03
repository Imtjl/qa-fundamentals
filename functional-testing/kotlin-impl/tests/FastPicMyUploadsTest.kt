import java.nio.file.Paths
import org.junit.jupiter.api.Assertions.*
import org.openqa.selenium.By
import org.openqa.selenium.WebElement

class FastPicMyUploadsTest : BaseBrowserTest() {
    override fun runTest() {
        var fileInput = findByXPath("//input[@type='file' and @id='file']")

        fileInput.sendKeys(JPG_IMAGE_PATH)

        var uploadButton =
            findByXPath("//input[@type='submit' and @id='uploadButton']")
        uploadButton.click()

        findByXPath("//div[contains(@class, 'picinfo')]")

        driver.get(BASE_URL + "/my.php")

        var checkAllLink = findByXPath("//a[@id='check_all']")
        assertTrue(
            checkAllLink.isDisplayed(),
            "Ссылка 'выбрать всё' должна отображаться",
        )

        var manageForm = findByXPath("//form[@id='manage-form']")
        assertTrue(
            manageForm.isDisplayed(),
            "Форма управления изображениями должна отображаться",
        )

        var thumbs: List<WebElement> =
            driver.findElements(By.xpath("//div[contains(@class, 'thumb')]"))
        assertTrue(
            thumbs.size > 0,
            "Должно быть хотя бы одно изображение на странице",
        )

        var firstThumb = thumbs.get(0)
        var thumbImage = firstThumb.findElement(By.xpath(".//img"))
        assertTrue(
            thumbImage.isDisplayed(),
            "Миниатюра изображения должна отображаться",
        )
    }
}
