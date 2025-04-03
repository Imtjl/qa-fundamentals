import org.openqa.selenium.WebDriver;

/**
 * Интерфейс, определяющий базовые операции для тестов с браузерами.
 * Все тестовые классы, использующие @AutoBrowser, должны реализовывать этот интерфейс.
 */
public interface BaseBrowserTestI {
    /**
     * Возвращает базовый URL для тестов.
     */
    String getBaseUrl();
    
    /**
     * Создает и настраивает WebDriver для указанного браузера.
     */
    WebDriver setupDriver(Browser browser);
    
    /**
     * Закрывает WebDriver после теста.
     */
    void tearDown();
}
