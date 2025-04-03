import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

/**
 * Тесты FastPic с аннотацией @AutoBrowser
 * Более простая версия, просто использующая аннотации и расширение.
 */
public class FastPicTest extends BaseBrowserTest {

    /**
     * Тест главной страницы - только для Edge
     */
    @AutoBrowser(value = Browser.EDGE, url = BASE_URL, name = "Главная страница в {0}")
    @DisplayName("Проверка главной страницы")
    void testMainPage(Browser browser) {
        System.out.println("testMainPage запущен с браузером: " + browser);
        
        // Проверка заголовка страницы
        String title = driver.getTitle();
        assertTrue(title.contains("FastPic"), "Заголовок страницы должен содержать 'FastPic'");

        // Проверка элементов
        WebElement fileInput = driver.findElement(By.xpath("//input[@type='file']"));
        assertTrue(fileInput.isDisplayed(), "Элемент загрузки файла должен быть видим");

        WebElement uploadSettings = driver.findElement(By.xpath("//div[contains(@class, 'upload_settings')]"));
        assertTrue(uploadSettings.isDisplayed(), "Настройки загрузки должны быть видимы");

        WebElement uploadButton = driver.findElement(By.xpath("//input[@type='submit' and @id='uploadButton']"));
        assertTrue(uploadButton.isDisplayed(), "Кнопка загрузки должна быть видима");
    }

    /**
     * Тест только для Chrome
     */
    @AutoBrowser(value = Browser.CHROME, url = BASE_URL, name = "Chrome тест")
    @DisplayName("Тест только в Chrome")
    void testChromeOnly(Browser browser) {
        System.out.println("testChromeOnly запущен с браузером: " + browser);
        
        // Базовая проверка
        String title = driver.getTitle();
        assertTrue(title.contains("FastPic"), "Заголовок страницы должен содержать 'FastPic'");

        WebElement fileInput = driver.findElement(By.xpath("//input[@type='file']"));
        assertTrue(fileInput.isDisplayed(), "Элемент загрузки файла должен быть видим");
    }

    /**
     * Тест для всех браузеров кроме Firefox
     */
    @AutoBrowser(value = Browser.FIREFOX, exclude = true, url = BASE_URL, name = "Вкладки в {0}")
    @DisplayName("Проверка вкладок (кроме Firefox)")
    void testTabsExceptEdge(Browser browser) {
        System.out.println("testTabsExceptEdge запущен с браузером: " + browser);
        
        // Проверяем переключение вкладок
        WebElement urlTabLink = driver.findElement(By.xpath("//a[@id='switch_to_copy']"));
        urlTabLink.click();

        WebElement urlTextarea = driver.findElement(By.xpath("//textarea[@id='upload_files']"));
        assertTrue(urlTextarea.isDisplayed(), "Поле для ввода URL должно быть видимым");
    }
}