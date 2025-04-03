import java.util.Iterator;
import java.util.Arrays;

/**
 * Перечисление поддерживаемых браузеров
 */
public enum Browser {
    CHROME,
    FIREFOX,
    EDGE;
    
    /**
     * Возвращает итератор по всем браузерам
     */
    public static Iterator<Browser> iterator() {
        return Arrays.asList(values()).iterator();
    }
}
