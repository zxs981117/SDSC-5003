package com.wsk.tool;

import cn.hutool.crypto.digest.MD5;
import net.coobird.thumbnailator.Thumbnails;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtils {

    private static class LayHolder {
        private static final StringUtils instance = new StringUtils();
    }

    private StringUtils() {
    }

    public static StringUtils getInstance() {
        return LayHolder.instance;
    }

    public String replaceBlank(String str) {
        String dest = "";
        if (str != null) {
            Pattern p = Pattern.compile("\\s*|\t|\r|\n");
            Matcher m = p.matcher(str);
            dest = m.replaceAll("");
        }
        return dest;
    }

    public String getRandomChar() {
        Random random = new Random();
        String s = "qw2ert1yui6opa7s3df9ghj5klz0x4cv8bnmQWERTYUIOPASDFGHJKLZXCVBNM";
        StringBuffer stringBuffer = new StringBuffer();
        char[] chars = s.toCharArray();
        for (int i = 0; i < 10; i++) {
            stringBuffer.append(chars[random.nextInt(s.length())]);
        }
        return stringBuffer.toString();
    }

    public String DateToString(Date date) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String result = simpleDateFormat.format(date);
        return result;
    }

    public boolean isPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        Pattern p = Pattern.compile("^1[3-9]\\d{9}$");
        Matcher m = p.matcher(phone.trim());
        return m.matches();
    }

    public String getMD5(String str) {
        return MD5.create().digestHex(str);
    }

    public boolean isNullOrEmpty(Object obj) {
        if (obj == null)
            return true;

        if (obj instanceof CharSequence)
            return ((CharSequence) obj).length() == 0;

        if (obj instanceof Collection)
            return ((Collection) obj).isEmpty();

        if (obj instanceof Map)
            return ((Map) obj).isEmpty();

        if (obj instanceof Object[]) {
            Object[] object = (Object[]) obj;
            if (object.length == 0) {
                return true;
            }
            boolean empty = true;
            for (int i = 0; i < object.length; i++) {
                if (!isNullOrEmpty(object[i])) {
                    empty = false;
                    break;
                }
            }
            return empty;
        }
        return false;
    }

    public ArrayList readTxt() throws IOException {
        ArrayList<String> list = new ArrayList<>();
        String encoding = "GBK";
        File file = new File("D:\\image\\txt\\all.txt");
        InputStreamReader reader = new InputStreamReader(new FileInputStream(file), encoding);
        BufferedReader bufferedReader = new BufferedReader(reader);
        String txt;
        while ((txt = bufferedReader.readLine()) != null) {
            list.add(txt);
        }
        reader.close();
        return list;
    }

    public String txtReplace(String test) {
        try {
            ArrayList<String> list = readTxt();
            test = test.replaceAll("\\s*|\t|\r|\n", "");
            for (String aList : list) {
                test = test.replaceAll(aList, "**");
            }
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return test;
    }

    public boolean thumbnails(String path, String save) {
        try {
            Thumbnails.of(path).size(215, 229).toFile(save);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static void main(String[] args) {
        System.err.println(getInstance().getMD5("123456"));
    }
}
