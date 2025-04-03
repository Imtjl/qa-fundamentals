import io.github.bonigarcia.wdm.WebDriverManager
import java.nio.file.Paths
import java.time.Duration
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.openqa.selenium.*
import org.openqa.selenium.chrome.ChromeDriver
import org.openqa.selenium.edge.EdgeDriver
import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.support.ui.ExpectedConditions
import org.openqa.selenium.support.ui.WebDriverWait

enum class Browser {
    CHROME,
    FIREFOX,
    EDGE;

    companion object {
        operator fun iterator(): Iterator<Browser> = values().iterator()
    }
}

abstract class BaseBrowserTest {
    companion object {
        const val BASE_URL = "https://fastpic.org"
        const val DEFAULT_TIMEOUT = 3

        val DOCS_BASE_PATH =
            Paths.get("")
                .toAbsolutePath()
                .parent // up from kotlin-impl
                .resolve("docs") // to docs directory
                .toString()
        val JPG_IMAGE_PATH = "$DOCS_BASE_PATH/test.jpg"
        val PNG_IMAGE_PATH = "$DOCS_BASE_PATH/test.png"
        val GIF_IMAGE_PATH = "$DOCS_BASE_PATH/test.gif"
        val LARGE_IMAGE_PATH = "$DOCS_BASE_PATH/large.jpg"

        const val TEST_IMAGE_URL = "https://placekitten.com/800/600"
    }

    // will be filled in @BeforeEach
    protected lateinit var driver: WebDriver

    private val drivers = mutableListOf<WebDriver>()
    private var currentBrowser: Browser? = null

    protected abstract fun runTest()

    @Test
    fun runAllBrowserTests() {
        for (browser in Browser) {
            if (drivers.size > 0) {
                cleanupDrivers()
            }
            try {
                driver = createDriver(browser)
                drivers.add(driver)
                driver.manage().window().maximize()
                driver.get(BASE_URL)

                runTest()
            } catch (e: Exception) {
                throw e
            }
        }
    }

    @AfterEach
    fun tearDown() {
        cleanupDrivers()
    }

    private fun cleanupDrivers() {
        for (d in drivers) {
            try {
                d.quit()
            } catch (e: Exception) {
                // Ignore errors when closing
            }
        }
        drivers.clear()
    }

    private fun createDriver(browser: Browser): WebDriver {
        return when (browser) {
            Browser.CHROME -> {
                WebDriverManager.chromiumdriver().setup()
                ChromeDriver()
            }
            Browser.FIREFOX -> {
                WebDriverManager.firefoxdriver().setup()
                FirefoxDriver()
            }
            Browser.EDGE -> {
                WebDriverManager.edgedriver().setup()
                EdgeDriver()
            }
        }
    }

    fun findByXPath(
        xpath: String,
        timeoutInSeconds: Int = DEFAULT_TIMEOUT,
    ): WebElement {
        val wait =
            WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds.toLong()))
        return wait.until(
            ExpectedConditions.presenceOfElementLocated(By.xpath(xpath))
        )
    }
}
