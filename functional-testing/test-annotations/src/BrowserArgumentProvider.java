import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;

/**
 * Провайдер аргументов для параметризированных тестов с браузерами.
 * Учитывает аннотацию @AutoBrowser для фильтрации браузеров.
 */
public class BrowserArgumentProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
        Method testMethod = context.getRequiredTestMethod();
        AutoBrowser annotation = testMethod.getAnnotation(AutoBrowser.class);
        
        // Если аннотации нет, возвращаем все браузеры
        if (annotation == null) {
            return Arrays.stream(Browser.values())
                   .map(Arguments::of);
        }

        Browser[] browsers = annotation.value();
        boolean exclude = annotation.exclude();

        // Если список браузеров пуст, и exclude=false, возвращаем все браузеры
        if (browsers.length == 0 && !exclude) {
            return Arrays.stream(Browser.values())
                   .map(Arguments::of);
        }

        List<Browser> targetBrowsers = Arrays.asList(browsers);
        
        return Arrays.stream(Browser.values())
               .filter(browser -> exclude != targetBrowsers.contains(browser))
               .map(Arguments::of);
    }
}