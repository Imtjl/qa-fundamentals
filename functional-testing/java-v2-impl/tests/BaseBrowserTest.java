import java.nio.file.Paths;
import java.time.Duration;

import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Базовый класс для тестов с браузерами.
 * Реализует интерфейс BaseBrowserTest из библиотеки test-annotations.
 */
public abstract class BaseBrowserTest implements BaseBrowserTestI {
    // Константы
    public static final String BASE_URL = "https://fastpic.org";
    public static final int DEFAULT_TIMEOUT = 3;
    
    public static final String DOCS_BASE_PATH = Paths.get("")
        .toAbsolutePath()
        .getParent() // up from java-impl
        .resolve("docs") // to docs directory
        .toString();
    
    public static final String JPG_IMAGE_PATH = DOCS_BASE_PATH + "/test.jpg";
    public static final String PNG_IMAGE_PATH = DOCS_BASE_PATH + "/test.png";
    public static final String GIF_IMAGE_PATH = DOCS_BASE_PATH + "/test.gif";
    public static final String LARGE_IMAGE_PATH = DOCS_BASE_PATH + "/large.jpg";
    
    public static final String TEST_IMAGE_URL = "https://placekitten.com/800/600";
    
    // WebDriver для текущего теста
    protected WebDriver driver;
    
    /**
     * Возвращает базовый URL для тестов.
     */
    @Override
    public String getBaseUrl() {
        return BASE_URL;
    }
    
    /**
     * Создает и настраивает WebDriver для указанного браузера.
     */
    @Override
    public WebDriver setupDriver(Browser browser) {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                // Ignore errors when closing
            }
        }
        driver = createDriver(browser);
        if (driver != null) {
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        }
        return driver;
    }
    
    /**
     * Закрывает WebDriver после теста.
     */
    @Override
    @AfterEach
    public void tearDown() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                // Ignore errors during cleanup
            }
            driver = null;
        }
    }
    
    /**
     * Создает экземпляр WebDriver для указанного браузера.
     */
    protected WebDriver createDriver(Browser browser) {
        try {
            switch (browser) {
                case CHROME:
                    WebDriverManager.chromedriver().setup();
                    ChromeOptions chromeOptions = new ChromeOptions();
                    chromeOptions.addArguments("--remote-allow-origins=*");
                    return new ChromeDriver(chromeOptions);
                
            case FIREFOX:
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions options = new FirefoxOptions();
                // Add options to help with Wayland issues
                options.addArguments("--no-sandbox");
                options.addArguments("--disable-dev-shm-usage");
                options.addArguments("--disable-gpu");
                return new FirefoxDriver(options);

                case EDGE:
                    WebDriverManager.edgedriver().setup();
                    return new EdgeDriver();
                
                default:
                    throw new IllegalArgumentException("Неподдерживаемый браузер: " + browser);
            }
        } catch (Exception e) {
            System.out.println("Ошибка при создании драйвера: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Находит элемент по XPath с ожиданием.
     */
    protected WebElement findByXPath(String xpath) {
        return findByXPath(xpath, DEFAULT_TIMEOUT);
    }
    
    /**
     * Находит элемент по XPath с указанным таймаутом.
     */
    protected WebElement findByXPath(String xpath, int timeoutInSeconds) {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeoutInSeconds));
        return wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath(xpath)));
    }
}
